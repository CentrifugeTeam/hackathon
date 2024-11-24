from typing import Literal
from redis.asyncio import Redis


class RedisClient(Redis):
    channel = 'accounts'

    async def listen(self, names: list[str]):
        ids = {name: '$' for name in names}
        while True:
            response = await self.xread(ids, count=1, block=0)
            key, messages = response[0]
            last_id, payload = messages[0]
            ids[key] = last_id
            yield key, payload
