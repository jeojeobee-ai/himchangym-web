import { NextResponse } from 'next/server';

const ADMIN = false;
async function handle(request,{params}) {
  const base=process.env.BACKEND_URL;
  if(!base) return NextResponse.json({message:'백엔드 연결을 준비하고 있어요. 아직 예약을 받을 수 없어요.'},{status:503});
  const {path}=await params;
  const mutating=!['GET','HEAD'].includes(request.method);
  if(mutating && request.headers.get('origin')!==new URL(request.url).origin)
    return NextResponse.json({message:'허용되지 않은 요청이에요.'},{status:403});
  const target=new URL(base);
  if(target.protocol!=='https:' && !['localhost','127.0.0.1'].includes(target.hostname))
    return NextResponse.json({message:'서버 연결 설정을 확인해 주세요.'},{status:503});
  const incoming=new URL(request.url);
  target.pathname='/'+path.map(encodeURIComponent).join('/');
  target.search=incoming.search;
  const headers={'Content-Type':'application/json'};
  const token=request.cookies.get('gym_session')?.value;
  if(token) headers.Authorization=`Bearer ${token}`;
  let upstream;
  try {
    upstream=await fetch(target,{method:request.method,headers,body:mutating?await request.text():undefined,cache:'no-store',signal:AbortSignal.timeout(65000)});
  } catch { return NextResponse.json({message:'서버에 연결하지 못했어요. 무료 서버가 깨어나는 데 잠시 걸릴 수 있어요. 다시 시도해 주세요.'},{status:503}); }
  let data;
  try {data=await upstream.json();} catch {return NextResponse.json({message:'서버 응답을 확인하지 못했어요.'},{status:502});}
  const responseToken=data.token;
  const account=data.account||(path.join('/')==='auth/me'?data:null);
  if(account?.role && (ADMIN ? account.role==='CUSTOMER' : account.role!=='CUSTOMER'))
    return NextResponse.json({message:ADMIN?'직원 계정으로 로그인해 주세요.':'회원 계정으로 로그인해 주세요.'},{status:403});
  delete data.token;
  const response=NextResponse.json(data,{status:upstream.status});
  response.headers.set('Cache-Control','no-store');
  if(responseToken)response.cookies.set('gym_session',responseToken,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:43200});
  if(upstream.status===401||path.join('/')==='auth/logout')response.cookies.delete('gym_session');
  return response;
}
export {handle as GET,handle as POST,handle as PATCH};
