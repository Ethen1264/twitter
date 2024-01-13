import { auth } from '../firebase';

export default function Home() {
  const logOut = () => {
    auth.signOut()      // 로그아웃 함수
  }
  return (
    <h1>
      <button onClick={logOut}>Log Out</button>        {/*로그아웃*/}
    </h1>
  );
}
