"""Servidor local do Kaizen: arquivos estáticos + API SQLite."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import sqlite3

ROOT = Path(__file__).parent
DB = ROOT / "kaizen.sqlite3"


def init_db():
    dados = json.loads((ROOT / "dados.json").read_text(encoding="utf-8"))
    with sqlite3.connect(DB) as con:
        con.execute("""CREATE TABLE IF NOT EXISTS tarefas (
            id TEXT PRIMARY KEY, titulo TEXT NOT NULL, status TEXT NOT NULL,
            prioridade TEXT NOT NULL, categoria TEXT NOT NULL DEFAULT 'Geral',
            prazo TEXT NOT NULL
        )""")
        con.execute("CREATE TABLE IF NOT EXISTS categorias (nome TEXT PRIMARY KEY)")
        colunas = {row[1] for row in con.execute("PRAGMA table_info(tarefas)")}
        if "categoria" not in colunas:
            con.execute("ALTER TABLE tarefas ADD COLUMN categoria TEXT NOT NULL DEFAULT 'Geral'")
        if con.execute("SELECT COUNT(*) FROM tarefas").fetchone()[0] == 0:
            con.executemany(
                "INSERT OR IGNORE INTO tarefas (id, titulo, status, prioridade, categoria, prazo) VALUES (?, ?, ?, ?, ?, ?)",
                [(t["id"], t["titulo"], t["status"], t["prioridade"], t.get("categoria", "Geral"), t["prazo"])
                 for t in dados.get("tarefas", [])],
            )
        con.executemany("INSERT OR IGNORE INTO categorias (nome) VALUES (?)", [(t.get("categoria", "Geral"),) for t in dados.get("tarefas", [])])


def listar():
    with sqlite3.connect(DB) as con:
        con.row_factory = sqlite3.Row
        return [dict(row) for row in con.execute("SELECT * FROM tarefas")]


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/tarefas":
            return self.responder(200, {"tarefas": listar()})
        return super().do_GET()

    def do_PUT(self):
        if self.path != "/api/tarefas":
            return self.responder(404, {"erro": "Rota não encontrada"})
        try:
            dados = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
            tarefas = dados["tarefas"]
            categorias = dados.get("categorias", [])
            with sqlite3.connect(DB) as con:
                con.execute("DELETE FROM tarefas")
                con.execute("DELETE FROM categorias")
                con.executemany(
                    "INSERT INTO tarefas (id, titulo, status, prioridade, categoria, prazo) VALUES (?, ?, ?, ?, ?, ?)",
                    [(t["id"], t["titulo"], t["status"], t["prioridade"], t.get("categoria", "Geral"), t["prazo"])
                     for t in tarefas],
                )
                con.executemany("INSERT OR IGNORE INTO categorias (nome) VALUES (?)", [(nome,) for nome in categorias])
            return self.responder(200, {"tarefas": listar()})
        except (KeyError, TypeError, ValueError, sqlite3.Error) as erro:
            return self.responder(400, {"erro": str(erro)})

    def responder(self, status, conteudo):
        corpo = json.dumps(conteudo, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)


if __name__ == "__main__":
    init_db()
    print("Kaizen disponível em http://localhost:8000")
    ThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
