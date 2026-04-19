import {createContext, useContext, useState} from 'react';

//global auth state manager
//instead of passing the token as props through every component, any component can call useAuth() to get the loggedin user,
//token,login and logout funcs.

//createContext creates a global "container" that can hold values (user, token, login, logout)
//any component inside <AuthProvider> can read from this container without needing props passed down
const AuthContext = createContext(null);

//reads whatever was saved in localStorage when the page last loaded or user last logged in
//this is how auth state survives a page refresh. we persist token and user in localStorage
const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    token: token || null,
    //user is stored as a JSON string, so we parse it back to an object
    //guard against the string "undefined" which localStorage stores if you accidentally set undefined
    user: user && user !== 'undefined' ? JSON.parse(user) : null,
  };
};

//AuthProvider wraps the entire app so all child components can access auth state
//children refers to everything rendered inside <AuthProvider>...</AuthProvider>
export const AuthProvider = ({children}) => {
  //this means on refresh, user and token are immediately set from storage instead of being null first
  const [user, setUser] = useState(() => getStoredAuth().user);
  const [token, setToken] = useState(() => getStoredAuth().token);

  //called after a successful login, saves token and user to both localStorage and react state
  //localStorage keeps it across refreshes, react state makes it reactive (components re-render on change)
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  //called on logout, wipes localStorage and resets state to null
  //any component reading user or token will immediately see null and can redirect to login
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN';

  //AuthContext.Provider makes the value available to all children via useAuth()
  return (
    <AuthContext.Provider value={{user, token, login, logout, isStudent, isAdmin}}>
      {children}
    </AuthContext.Provider>
  );
};

//useAuth is the hook components call to read from the context
//e.g. const {user, login, logout} = useAuth()
//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
