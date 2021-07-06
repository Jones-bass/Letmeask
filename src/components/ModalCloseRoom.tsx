import '../styles/modalRoom.scss';
import CloseRoomImg from '../assets/images/close-room.svg';

import { useHistory, useParams } from 'react-router-dom';
import { database } from '../services/firebase';


type ModalType = {
  setIsOpen: (value: boolean) => void;
};

type RoomParams = {
  id: string;
};
export function ModalCloseRoom({ setIsOpen }: ModalType) {
  const { id: roomId } = useParams<RoomParams>();
  const history = useHistory();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
  }

  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        <img src={CloseRoomImg} alt="Encerrar sala" />
        <h1>Encerrar sala</h1>
        <p>Tem certeza que você deseja encerrar esta sala?</p>
        <div className="buttons-container">
          <button onClick={() => setIsOpen(false)}>Cancelar</button>
          <button onClick={handleEndRoom}>Sim, excluir</button>
        </div>
      </div>
    </div>
  );
}