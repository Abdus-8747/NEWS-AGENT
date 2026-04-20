import redis
from rq import Worker, Queue, Connection

listen = ["news-tasks"]

redis_conn = redis.Redis(host="localhost", port=6379)

if __name__ == "__main__":
    with Connection(redis_conn):
        worker = Worker([Queue(name) for name in listen])
        worker.work()