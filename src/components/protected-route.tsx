import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser;        //사용자의 정보를 불러옴
  console.log(user);          
  if (user === null) {                  // 만약 로그인 되지 않았다면 login 페이지로 이동되게 된다
    return <Navigate to="/login" />;
  }

  return children;
}
