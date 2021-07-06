 
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { ModalDelete } from '../components/ModalDeleteRoom';
import { ModalCloseRoom } from '../components/ModalCloseRoom';

import { Question } from '../components/Question';

import { RoomCode } from '../components/RoomCode';
import logoImg from '../assets/images/logo.svg';
import DeleteImg from '../assets/images/delete.svg';
import CheckImg from '../assets/images/check.svg';
import AnswerImg from '../assets/images/answer.svg';

import '../styles/room.scss';

import { useRoom } from '../hooks/useRoom';
import { useState } from 'react';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id: roomId } = useParams<RoomParams>();
  const { title, questions } = useRoom(roomId);

  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  function handleCLoseDeleteModal() {
    setModalDeleteIsOpen(true);
  }
  function handleCLoseModal() {
    setIsOpen(true);
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCLoseModal}>
              Encerrar sala
            </Button>
            {modalIsOpen && <ModalCloseRoom setIsOpen={setIsOpen} />}
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>

          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighLighted}
              key={question.id}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleCheckQuestionAsAnswered(question.id);
                    }}
                  >
                    <img src={CheckImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleHighlightQuestion(question.id);
                    }}
                  >
                    <img src={AnswerImg} alt="Dar destaque a pergunta" />
                  </button>
                </>
              )}
              <button type="button" onClick={handleCLoseDeleteModal}>
                <img src={DeleteImg} alt="Remover pergunta" />
              </button>
              {modalDeleteIsOpen && (
                <ModalDelete
                  questionId={question.id}
                  setModalDeleteIsOpen={setModalDeleteIsOpen}
                />
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}