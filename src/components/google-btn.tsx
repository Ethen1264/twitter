import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.span`
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 50px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();      // 구글의 provider를 받는다
      await signInWithPopup(auth, provider);    // 접근 권한과 provider를 인증한다
      navigate('/')     // main화면으로 이동한다
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/google-logo.svg" />
      Continue with Google
    </Button>
  );
}
