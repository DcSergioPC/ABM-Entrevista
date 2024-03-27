import { useEffect, useState } from 'react'
import './App.css'
import './styles.css'
import { defaultUsers } from './users'
function fetchingUsers(setUsers){
  if (sessionStorage.getItem('users')) {
    setUsers(JSON.parse(sessionStorage.getItem('users')))
    console.log("Skip Fetching")
    return
  }
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem('users', JSON.stringify(data))
      setUsers(data)
      console.log(data)
    })
}

function useUsers(){
  const [users, setUsers] = useState(null)
  useEffect(()=>{
    fetchingUsers(setUsers)
  }, [])
  return [users,setUsers]
}

function App() {
  const [users, setUsers] = useUsers([])
  const [errors, setErrors] = useState([])
  const [modify, setModify] = useState(false)
  const [user, setUser] = useState(null)
  console.log(users)
  useEffect(()=>{
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])
  function removeUser(id){
    return ()=>{setUsers(users.filter(user=>user.id !== id))}
  }
  const Lista = ({users: Array}) =>(
    <>
      <h1>Lista de usuarios</h1>
      <table style={{textAlign: 'left'}}>
          <thead>
            <tr style={{textAlign: 'center'}}>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
          {users && users.map(user=>(
            <tr key = {user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address.street}</td>
              <td>{user.phone}</td>
              <td><button onClick={()=>{setModify(true);setUser(user);setErrors([])}}>Edit</button><button onClick={removeUser(user.id)} className='remove'>x</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
    )

    const validate = (user)=>{
      const errors = {}
      if(!user.name) errors.name = 'El nombre es obligatorio'
      if(!user.username) errors.username = 'El nombre de usuario es obligatorio'
      if(!user.email) errors.email = 'El email es obligatorio'
      if(!user.address?.street) errors.address = 'La dirección es obligatoria'
      if(!user.phone) errors.phone = 'La dirección es obligatoria'
      return errors
    }
    const Alta = ({edit=false, user}) =>(
      <>
        <h1>{edit && user ?  `Editar Usuario ${user.id} ${user.name}` :"Crear usuario"}</h1>{edit ? <button className='remove' onClick={()=>{setUser(null);setModify(false);setErrors([])}}>Cancelar</button> : null}
        <form onSubmit={(e)=>{
            e.preventDefault()
            const form = e.target
            const newUser = {
              id: Math.floor(50+Math.random() * 10000),
              name: form.name.value,
              username: form.username.value,
              email: form.email.value,
              address: {street: form.address.value},
              phone: form.phone.value
            }
            const val = validate(newUser)
            if(Object.keys(val).length > 0){
              setErrors(val)
              return
            }
            if(edit){
              const index = users.findIndex(u=>u.id === user.id)
              newUser.id = user.id
              users[index] = {...users[index],...newUser}
              setUsers([...users])
              setModify(false)
              setUser(null)
              setErrors([])
              return
            }
            setUsers([newUser,...users])
            form.reset()
          }}>
          <input type="text" name='name' placeholder="Nombre" defaultValue={user ? user.name :""} />
          {errors.name && <div>{errors.name}</div>}
          <input type="text" name='username' placeholder="Usuario" defaultValue={user ? user.username :""} />
          {errors.username && <div>{errors.username}</div>}
          <input type="email" name='email' placeholder="Email" defaultValue={user ? user.email :""} />
          {errors.email && <div>{errors.email}</div>}
          <input type="text" name='address' placeholder="Dirección" defaultValue={user ? user.address.street :""} />
          {errors.address && <div>{errors.address}</div>}
          <input type="text" name='phone' placeholder="Telefono" defaultValue={user ? user.phone :""} />
          {errors.phone && <div>{errors.phone}</div>}
          <button type='submit' style={edit ? {backgroundColor: "green"}:{}}>{edit ? "Editar" : "Crear"}</button>
        </form>
      </>
    )

  return (
    <>
      {!modify && <Alta />}
      {modify && <Alta edit={true} user={user} />}
      {!modify && <Lista users={users}/>}
    </>
  )
}

export default App