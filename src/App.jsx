import { useEffect, useState } from 'react'
import './App.css'
import './styles.css'
function fetchingUsers(setUsers){
  const users = JSON.parse(localStorage.getItem('users'))
  if (users) {
    setUsers(users)
    console.log("Skip Fetching")
    return
  }
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetching")
      setUsers(data)
    })
}

function useUsers(){
  const [users, setUsers] = useState(null)

  useEffect(()=>{
    if(users) localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(()=>{
    fetchingUsers(setUsers)
    const title = document.querySelector('title')
    title.innerText = 'ABM'
  }, [])
  
  return [users,setUsers]
}

function App() {
  const [users, setUsers] = useUsers([])
  const [errors, setErrors] = useState([])
  const [modify, setModify] = useState(false)
  const [user, setUser] = useState(null)
  const Lista = ({users}) =>{
    function comeBack(user){
      return ()=>{
        setModify(true)
        setUser(user)
        setErrors([])
      }
    }
    function removeUser(id){
      return ()=>{setUsers(users.filter(user => user.id !== id))}
    }
    return (
    <>
      <h2>Lista de usuarios</h2>
      <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>Acciones</th>
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
              <td>
                <button className='btn-green' onClick={comeBack(user)}>Editar</button>
                <button onClick={removeUser(user.id)} className='remove'>x</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='btn-margin10'
        onClick={()=>{
          localStorage.removeItem('users')
          fetchingUsers(setUsers)
        }}
        >Reiniciar</button>
    </>
    )}

    const AltaModificacion = ({edit=false, user}) =>{
      const validate = (user)=>{
        const errors = {}
        if(!user.name)              errors.name =       'El nombre es obligatorio'
        if(!user.username)          errors.username =   'El nombre de usuario es obligatorio'
        if(!user.email)             errors.email =      'El email es obligatorio'
        if(!user.address?.street)   errors.address =    'La dirección es obligatoria'
        if(!user.phone)             errors.phone =      'La dirección es obligatoria'
        return errors
      }
      function formSubmit(e){
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
      }
      return (
      <>
        <h2>{edit && user ?  `Editar Usuario '${user.id}': ${user.name}` : 'Crear usuario'}</h2>
        {edit ? <button className='remove' onClick={()=>{setUser(null);setModify(false);setErrors([])}}>Cancelar</button> : null}
        <form onSubmit={formSubmit}>

          <label>Nombre</label>
          <input type="text" name='name' placeholder="Juan Perez" defaultValue={user ? user.name :""} />
          <div className={errors.name ? '':'hidden min-height'}>{errors.name}</div>
          
          <label>Usuario</label>
          <input type="text" name='username' placeholder="juanpe" defaultValue={user ? user.username :""} />
          <div className={errors.username ? '':'hidden min-height'}>{errors.username}</div>
          
          <label>Email</label>
          <input type="email" name='email' placeholder="janpe@mail.com" defaultValue={user ? user.email :""} />
          <div className={errors.email ? '':'hidden min-height'}>{errors.email}</div>
          
          <label>Dirección</label>
          <input type="text" name='address' placeholder="Calle 1" defaultValue={user ? user.address.street :""} />
          <div className={errors.address ? '':'hidden min-height'}>{errors.address}</div>
          
          <label>Telefono</label>
          <input type="text" name='phone' placeholder="123456789" defaultValue={user ? user.phone :""} />
          <div className={errors.phone ? '':'hidden min-height'}>{errors.phone}</div>

          <button type='submit' className={edit ? 'btn-green':''}>{edit ? "Editar" : "Crear"}</button>
        </form>
      </>
    )}

  return (
    <>
      <h1>ABM</h1>
      {!modify && <AltaModificacion />}
      {modify && <AltaModificacion edit={true} user={user} />}
      {!modify && <Lista users={users}/>}
    </>
  )
}

export default App
