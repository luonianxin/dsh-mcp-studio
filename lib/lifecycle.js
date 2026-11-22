// 清理回调可能忽略取消；等待有界，迟到的拒绝仍被消费。
export async function settleWithin(work, ms = 1000) {
  let timer;
  try {
    await Promise.race([
      Promise.resolve().then(work).catch(() => {}),
      new Promise(resolve => { timer = setTimeout(resolve, ms); })
    ]);
  } finally { clearTimeout(timer); }
}

export function withAbort(promise, signal) {
  if (!signal) return promise;
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason ?? new DOMException('Cancelled', 'AbortError'));
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
