import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Form, Error, Input, Switcher2, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-btn';
import GoogleButton from '../components/google-btn';


export default function CreateAccount() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {    // 리액트 html의 변화한 이밴트를 불러온다
    const {
      target: { name, value },      // target을 name과 value로 설정을 한다
    } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit =async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if(isLoading || name === "" || email === "" || password === "") return
    try{
      setLoading(true)
      const credentials = await createUserWithEmailAndPassword(auth, email, password) // auth의 접근 권한과 input에 보낸 email과  password를 보낸다.
      console.log(credentials.user)
      await updateProfile(credentials.user,{      // 위에서 가입한 계정을 불러온다
        displayName:name          // name을 등록한다
      })
      navigate('/')       // main page로 이동시킨다
    } catch(e){  
      if(e instanceof FirebaseError) {      // e instanceof FirebaseError는 e가 FirebaseError 클래스의 인스턴스인지 여부를 확인하는 조건
        setError(e.message)
      }
    }finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <Title>Join X</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required />
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="text" required />
        <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
        <Input type="submit" value={isLoading ? "Loading...":"Create Account"} />
      </Form>
      {error !=="" ? <Error>{error}</Error>: null}
      <Switcher2>
        Already have an account? <Link to="/login">log in &rarr;</Link>
      </Switcher2>
      <GithubButton />
      <GoogleButton/>
    </Wrapper>
  );
}
