import redis
from rq import Queue

redis_conn = redis.Redis(
    host="localhost",   # or Redis Cloud URL
    port=6379,
    db=0
)

queue = Queue("news-tasks", connection=redis_conn)