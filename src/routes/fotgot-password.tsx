import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState(''); 

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {    // 리액트 html의 변화한 이밴트를 불러온다
    const {
      target: { name, value },      // target을 name과 value로 설정을 한다
    } = e;
    if (name === 'email') {
      setEmail(value);
    } 
  };

  const onSubmit =async (e:React.FormEvent<HTMLFormElement>) => {       // html 리액트에서 버튼 반응을 감지
    e.preventDefault()
    try{
      sendPasswordResetEmail(auth, email)   // 이메일과 접근 권한을 인증한다
      navigate('/')
    } catch(e){  
      console.log(e)
    }finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <Title>Reset password</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="text" required />
        <Input type="submit" value={isLoading ? "Loading...":"Send Eamil"} />
      </Form>
      <Switcher>
        Already have an account? <Link to="/login">log in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
