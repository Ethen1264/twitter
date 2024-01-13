import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Form, Error, Input, Switcher, Title, Wrapper, Switcher2 } from '../components/auth-components';
import GithubButton from '../components/github-btn';
import GoogleButton from '../components/google-btn';

export default function CreateAccount() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {        // 리액트 html의 변화한 이밴트를 불러온다
    const {
      target: { name, value },        // target을 name과 value로 설정을 한다.
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit =async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if(isLoading || email === "" || password === "") return
    try{
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)       // auth의 접근 권한과 input에 보낸 email과  password를 보낸다. 맞약 이 값이 맞다면 main 페이지로 이동한다.
      navigate('/')
    } catch(e){  
      if(e instanceof FirebaseError) {      // e instanceof FirebaseError는 e가 FirebaseError 클래스의 인스턴스인지 여부를 확인하는 조건
        setError(e.message)     // 틀렸다면 error 메시지를 출력한다
      }
    }finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <Title>Log into X</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="text" required />
        <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
        <Input type="submit" value={isLoading ? "Loading...":"Log in"} />
      </Form>
      {error !=="" ? <Error>{error}</Error>: null}
      <Switcher>
        Dont't have an account? <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <Switcher2>
        Forgot your password? <Link to="/forgot-password">Reset password &rarr;</Link>
      </Switcher2>
      <GithubButton/>
      <GoogleButton/> 
    </Wrapper>
  );
}
