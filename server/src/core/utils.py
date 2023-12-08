import time
import random
import string

from typing import Any
from functools import wraps


def timeit(func: Any):
    @wraps(func)
    def compute_execution_time(*args, **kwargs):
        start_time = time.perf_counter()
        res = func(*args, **kwargs)
        end_time = time.perf_counter()

        print(f"Func {func.__name__} finished in {(end_time - start_time):.4f}s")
        return res

    return compute_execution_time


def generate_alphanumeric_id(length=10, case_sensitive=False):
    sample_space = (
        string.digits
        + string.ascii_uppercase
        + (string.ascii_lowercase if not case_sensitive else "")
    )
    return "".join([random.choice(sample_space) for _ in range(length)])
