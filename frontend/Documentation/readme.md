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
