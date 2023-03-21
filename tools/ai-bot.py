from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi
import json
import os
import ssl
import sys

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'OK')

    def do_POST(self):
        if self.path == '/q2df':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )

            question = form.getvalue('question')
            df = ("+----+-------------+----------------+\n"
                  "|    |   author_id |   num_messages |\n"
                  "|----+-------------+----------------|\n"
                  "|  0 | 5.45239e+17 |           4126 |\n"
                  "+----+-------------+----------------+\n")
            query = ("-- Using the data from the cadena.messages table, "
                     "this query will count the number of messages sent "
                     "by each author and return the author_id of the author "
                     "who sent the most messages\n\n"
                     "SELECT author_id, COUNT(*) AS num_messages\n"
                     "FROM cadena.messages\n"
                     "GROUP BY author_id\n"
                     "ORDER BY num_messages DESC\n"
                     "LIMIT 1;\n\n"
                     "-- This query will return the author_id of the author who "
                     "sent the most messages, along with the total number of "
                     "messages sent by that author.")
            data = dict(data_frame=df, executed_query=query)
            response = dict(data=data)
            self.wfile.write(json.dumps(response).encode())

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 5000), RequestHandler)
    path = os.path.dirname(sys.argv[0])
    ssl_cert = os.path.join(path, 'server.crt')
    ssl_key = os.path.join(path, 'server.key')
    server.socket = ssl.wrap_socket(server.socket, server_side=True, certfile=ssl_cert, keyfile=ssl_key)
    print('Starting server at https://127.0.0.1:5000')
    server.serve_forever()
