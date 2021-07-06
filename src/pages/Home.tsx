import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, FormEvent } from 'react';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button';

import '../styles/auth.scss'; 
import { database } from '../services/firebase';


export function Home() { 
const history = useHistory();
const { user, signInWithGoogle } = useAuth()
const [roomCode, setRoomCode] = useState('');

async function handleCreateRoom() {
  if(!user) {
    await signInWithGoogle()
  }

    history.push('./rooms/new');
}

async function handleJoinRoom(event: FormEvent) {
  event.preventDefault();

  if (roomCode.trim() === '') {
    return;
  }

  const roomRef = await database.ref(`rooms/${roomCode}`).get();

  if (!roomRef.exists()) {
    alert('Room does not exists.');
    return;
  }

  history.push(`rooms/${roomCode}`);
}

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respotas" />
        <strong>crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas duvidas da sua audiencia em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo Google" />
            Crie sua sala com Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o codigo da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )

}