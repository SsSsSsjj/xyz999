import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase.js'
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

function Guestbook({ hauntingActive = false, isPossessed = false }) {
  const [entries, setEntries] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('loading')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authStatus, setAuthStatus] = useState('loading')
  const [authFeedback, setAuthFeedback] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const isValid = useMemo(
    () => name.trim().length > 0 && message.trim().length > 0,
    [name, message],
  )

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      setIsAdmin(false)
      setAuthFeedback('')

      if (!nextUser) {
        setAuthStatus('ready')
        return
      }

      setAuthStatus('checking')
      try {
        const adminSnapshot = await getDoc(doc(db, 'admins', nextUser.uid))
        setIsAdmin(adminSnapshot.exists())
        setAuthFeedback(
          adminSnapshot.exists()
            ? '관리자로 로그인했습니다.'
            : '이 Google 계정에는 관리자 권한이 없습니다.',
        )
      } catch {
        setAuthFeedback('관리자 권한을 확인하지 못했습니다.')
      } finally {
        setAuthStatus('ready')
      }
    })
  }, [])

  useEffect(() => {
    const guestbookQuery = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(20),
    )

    return onSnapshot(
      guestbookQuery,
      (snapshot) => {
        setEntries(snapshot.docs.map((entryDoc) => ({ id: entryDoc.id, ...entryDoc.data() })))
        setStatus('ready')
      },
      () => setStatus('error'),
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

  async function handleGoogleLogin() {
    setAuthFeedback('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthFeedback('Google 로그인에 실패했습니다.')
      }
    }
  }

  async function handleLogout() {
    await signOut(auth)
  }

  async function handleDelete(entry) {
    if (!isAdmin || deletingId) return
    if (!window.confirm(`${entry.name}님의 댓글을 삭제할까요?`)) return

    setDeletingId(entry.id)
    setAuthFeedback('')
    try {
      await deleteDoc(doc(db, 'guestbook', entry.id))
      setAuthFeedback('댓글을 삭제했습니다.')
    } catch {
      setAuthFeedback('댓글을 삭제하지 못했습니다. 관리자 권한을 확인해 주세요.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="guestbook-section" id="guestbook" aria-labelledby="guestbook-title">
      <div className="container guestbook-layout">
        <div className="guestbook-intro">
          <p className="section-index">05 · {isPossessed ? '증언 보관함' : 'GUESTBOOK'}</p>
          <h2 id="guestbook-title">{isPossessed ? <>삭제된 방문자의<br />마지막 증언</> : <>서로 다른<br />흔적을 남겨주세요.</>}</h2>
          <p>{isPossessed ? '아래 기록의 작성자는 모두 같은 시각에 접속이 끊겼습니다. 이름은 복구되지 않았습니다.' : '짧은 인사나 응원의 한마디도 좋아요. 가장 최근에 남긴 스무 개의 메시지를 함께 보여드립니다.'}</p>

          <div className="admin-login">
            {user ? (
              <>
                <div className="admin-account">
                  {user.photoURL && <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />}
                  <div>
                    <strong>{user.displayName || user.email}</strong>
                    <span>{isAdmin ? '관리자' : '일반 계정'}</span>
                  </div>
                </div>
                <button type="button" className="admin-button" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <button
                type="button"
                className="admin-button google-login"
                onClick={handleGoogleLogin}
                disabled={authStatus !== 'ready'}
              >
                <span aria-hidden="true">G</span> 관리자 Google 로그인
              </button>
            )}
            <p className="admin-feedback" aria-live="polite">{authFeedback}</p>
          </div>
        </div>

        <div className="guestbook-content">
          <form className="guestbook-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="guest-name">{isPossessed ? '기록될 이름' : '이름'}</label>
              <input id="guest-name" name="name" type="text" value={name} maxLength={NAME_LIMIT}
                onChange={(event) => setName(event.target.value)} placeholder={isPossessed ? '이미 알고 있지만 확인합니다' : '어떻게 불러드릴까요?'}
                autoComplete="name" required />
              <small>{name.length}/{NAME_LIMIT}</small>
            </div>

            <div className="field-group">
              <label htmlFor="guest-message">{isPossessed ? '마지막으로 남길 문장' : '메시지'}</label>
              <textarea id="guest-message" name="message" value={message} maxLength={MESSAGE_LIMIT}
                onChange={(event) => setMessage(event.target.value)} placeholder={isPossessed ? '삭제해도 다시 나타납니다' : '서진에게 한마디 남겨주세요.'}
                rows="4" required />
              <small>{message.length}/{MESSAGE_LIMIT}</small>
            </div>

            <button className="button guestbook-submit" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? '기록하는 중…' : isPossessed ? '증언을 기록에 추가' : '방명록 남기기'} <span aria-hidden="true">↗</span>
            </button>
            <p className="form-feedback" aria-live="polite">{feedback}</p>
          </form>

          <div className="guestbook-list" aria-live="polite" aria-busy={status === 'loading'}>
            {status === 'loading' && <p className="guestbook-state">방명록을 불러오는 중…</p>}
            {status === 'error' && <p className="guestbook-state error">방명록을 불러오지 못했습니다.</p>}
            {status === 'ready' && entries.length === 0 && (
              <p className="guestbook-state">아직 첫 메시지를 기다리고 있어요.</p>
            )}
            {hauntingActive && (
              <article className="guestbook-entry ghost-entry" aria-hidden="true">
                <div>
                  <div className="guestbook-meta">
                    <strong>{isPossessed ? '[작성자가 삭제됨]' : '　'}</strong>
                    <time>{isPossessed ? '내일 오전 03:17' : '방금 전'}</time>
                  </div>
                </div>
                <p>{isPossessed ? '4초면 충분했습니다. 이제 당신이 움직여도 잊지 않습니다.' : '여기 아직도 운영하고 있네요.'}</p>
              </article>
            )}
            {entries.map((entry) => (
              <article className="guestbook-entry" key={entry.id}>
                <div>
                  <div className="guestbook-meta">
                    <strong>{entry.name}</strong>
                    <time>{formatDate(entry.createdAt)}</time>
                  </div>
                  {isAdmin && (
                    <button type="button" className="delete-entry" onClick={() => handleDelete(entry)}
                      disabled={deletingId === entry.id} aria-label={`${entry.name}님의 댓글 삭제`}>
                      {deletingId === entry.id ? '삭제 중…' : '삭제'}
                    </button>
                  )}
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
