// Fair shuffle bag: finish unseen items from a list before a new cycle starts.
function createFairStudyQueue(items, activityKey){
  const seenStorageKey = `studySeen:${activityKey}`;
  const itemKey = item => `${String(item?.en || '').trim().toLowerCase()}\u0000${String(item?.vi || '').trim().toLowerCase()}`;
  const uniqueItems = [];
  const uniqueKeys = new Set();

  for(const item of items || []){
    const key = itemKey(item);
    if(!key.replace('\u0000','') || uniqueKeys.has(key)) continue;
    uniqueKeys.add(key);
    uniqueItems.push(item);
  }

  let seen = new Set();
  try{
    const saved = JSON.parse(localStorage.getItem(seenStorageKey) || '[]');
    if(Array.isArray(saved)) seen = new Set(saved);
  }catch{}

  let pending = uniqueItems.filter(item => !seen.has(itemKey(item)));
  if(pending.length === 0 && uniqueItems.length){
    seen.clear();
    localStorage.setItem(seenStorageKey, '[]');
    pending = [...uniqueItems];
  }

  for(let i = pending.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [pending[i], pending[j]] = [pending[j], pending[i]];
  }

  return {
    items: pending,
    markSeen(item){
      const key = itemKey(item);
      if(!key.replace('\u0000','')) return;
      seen.add(key);
      localStorage.setItem(seenStorageKey, JSON.stringify([...seen]));
    }
  };
}
