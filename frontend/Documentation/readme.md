# 1) Redux Setup
1) npm install @reduxjs/toolkit
2) npm install react-redux
3) inside src mkdir store and store.ts
4) create authSlice.ts (in same folder)
5) create reducers in authSlice along with few more stuff  
6) import the above created reducer to store
7) import useDispatch (in the components where you handle data logic and want to dispatch to store)
8) import store and provider in the starting point (i.e main.tsx) 
wrap app in <Provider store={store}><Provider/>
9) next Steps?? Learn redux thunk and see if it can be implemented.
    performing async functions in RTK

# 2) react-router-dom
1) npm install react-router-dom
2) mkdir Pages, make the tsx files inside 
3) In the main.jsx file, add a Browser Router enclosing the entire app.jsx.
4) Add Routes in App.tsx
    <Routes>
      <Route path="/" element={<div>Welcome to the Home page</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/dsa" element={<DSA />} />
      <Route path="/contests" element={<Contests />} />
    </Routes>
5) To use Buttons and navigate (when you need to control the flow like when fetching data)  
import useNavigate  
const navigate = useNavigate();
navigate("/yourRout");  #you can place this in a buttonClickHandleFunction


