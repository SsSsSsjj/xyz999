import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firestore.js'

const NAME_LIMIT = 20
const MESSAGE_LIMIT = 200

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '방금 전'

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp.toDate())
}

function Guestbook() {
  const [entries, setEntries] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('loading')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = useMemo(
    () => name.trim().length > 0 && message.trim().length > 0,
    [name, message],
  )

  useEffect(() => {
    const guestbookQuery = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(20),
    )

    return onSnapshot(
      guestbookQuery,
      (snapshot) => {
        setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        setStatus('ready')
      },
      () => {
        setStatus('error')
      },
    )
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setFeedback('')

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      })
      setName('')
      setMessage('')
      setFeedback('방명록을 남겼어요. 고맙습니다!')
    } catch {
      setFeedback('등록하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="guestbook-section" id="guestbook" aria-labelledby="guestbook-title">
      <div className="container guestbook-layout">
        <div className="guestbook-intro">
          <p className="section-index">05 · GUESTBOOK</p>
          <h2 id="guestbook-title">잠깐 들른<br />흔적을 남겨주세요.</h2>
          <p>짧은 인사도, 응원의 한마디도 좋아요. 가장 최근에 남겨진 스무 개의 메시지를 함께 보여드립니다.</p>
        </div>

        <div className="guestbook-content">
          <form className="guestbook-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="guest-name">이름</label>
              <input
                id="guest-name"
                name="name"
                type="text"
                value={name}
                maxLength={NAME_LIMIT}
                onChange={(event) => setName(event.target.value)}
                placeholder="어떻게 불러드릴까요?"
                autoComplete="name"
                required
              />
              <small>{name.length}/{NAME_LIMIT}</small>
            </div>

            <div className="field-group">
              <label htmlFor="guest-message">메시지</label>
              <textarea
                id="guest-message"
                name="message"
                value={message}
                maxLength={MESSAGE_LIMIT}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="서진에게 한마디 남겨주세요."
                rows="4"
                required
              />
              <small>{message.length}/{MESSAGE_LIMIT}</small>
            </div>

            <button className="button guestbook-submit" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? '남기는 중…' : '방명록 남기기'} <span aria-hidden="true">↗</span>
            </button>
            <p className="form-feedback" aria-live="polite">{feedback}</p>
          </form>

          <div className="guestbook-list" aria-live="polite" aria-busy={status === 'loading'}>
            {status === 'loading' && <p className="guestbook-state">방명록을 불러오는 중…</p>}
            {status === 'error' && <p className="guestbook-state error">방명록을 불러오지 못했습니다.</p>}
            {status === 'ready' && entries.length === 0 && (
              <p className="guestbook-state">아직 첫 메시지를 기다리고 있어요.</p>
            )}
            {entries.map((entry) => (
              <article className="guestbook-entry" key={entry.id}>
                <div>
                  <strong>{entry.name}</strong>
                  <time>{formatDate(entry.createdAt)}</time>
                </div>
                <p>{entry.message}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Guestbook
