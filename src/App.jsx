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
  window.setUser = setUser
  window.user = user
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
        if(!user.name)                  errors.name =           'El nombre es obligatorio'
        else if(user.name.length < 3)   errors.name =           'El nombre debe tener al menos 3 caracteres'

        if(!user.username) errors.username = 'El nombre de usuario es obligatorio'
        else if(user.username.length < 3) errors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
        else if(user.username.length > 15) errors.username = 'El nombre de usuario no puede tener más de 15 caracteres'
        else if(!/^[a-zA-Z0-9]+$/.test(user.username)) errors.username = 'El nombre de usuario solo puede contener letras y numeros'
        else if(users.find(u => u.username === user.username && u.id !== user.id)) errors.username = 'El nombre de usuario ya existe'

        if(!user.email) errors.email = 'El email es obligatorio'
        else if(users.find(u => u.email === user.email && u.id !== user.id)) errors.email = 'El email ya existe'
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) errors.email = 'El email no es valido'

        if(!user.address?.street)       errors.street =         'La calle es obligatoria'
        if(!user.address?.suite)        errors.suite =          'La suite es obligatoria'
        if(!user.address?.city)         errors.city =           'La ciudad es obligatoria'
        if(!user.address?.zipcode)      errors.zipcode =        'El C.P. es obligatorio'
        
        if(!user.address?.geo?.lat)     errors.lat =            'La latitud es obligatoria'
        else if(!/^-?\d+(\.\d+)?$/.test(user.address?.geo?.lat)) errors.lat = 'La latitud no es valida'
        else if(user.address?.geo?.lat < -90 || user.address?.geo?.lat > 90) errors.lat = 'La latitud no puede ser mayor a 90 o menor a -90'

        if(!user.address?.geo?.lng)     errors.lng =            'La longitud es obligatoria'
        else if(!/^-?\d+(\.\d+)?$/.test(user.address?.geo?.lng)) errors.lng = 'La longitud no es valida'
        else if(user.address?.geo?.lng < -180 || user.address?.geo?.lng > 180) errors.lng = 'La longitud no puede ser mayor a 180 o menor a -180'

        if(!user.phone)                 errors.phone =          'El telefono es obligatorio'
        else if(!/^(\d|\+)+$/.test(user.phone)) errors.phone = 'El telefono no es valido'
        else if(user.phone.length < 10) errors.phone = 'El telefono no puede tener menos de 10 digitos'

        if(!user.website)               errors.website =        'El sitio web es obligatorio'
        else if(!/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/.test(user.website)) errors.website = 'El sitio web no es valido'

        if(!user.company?.name)         errors.cname =          'El nombre de la compañia es obligatorio'
        if(!user.company?.catchPhrase)  errors.catchPhrase =    'El eslogan de la compañia es obligatoria'
        if(!user.company?.bs)           errors.bs =             'El business speak de la empresa es obligatoria'

        return errors
      }
      function formSubmit(e){
        e.preventDefault()
        const form = e.target
        const newUser = {
          id: Math.floor(50+Math.random() * 10000),
          name: form.name?.value,
          username: form.username?.value,
          email: form.email?.value,
          address: {
            street: form.street?.value,
            suite: form.suite?.value,
            city: form.city?.value,
            zipcode: form.zipcode?.value,
            geo: {
              lat: form.lat?.value,
              lng: form.lng?.value
            }
          },
          phone: form.phone?.value,
          website: form.website?.value,
          company: {
            name: form.company?.value,
            catchPhrase: form.catchPhrase?.value,
            bs: form.bs?.value
          }
        }
        if(edit) newUser.id = user.id
        const val = validate(newUser)
        if(Object.keys(val).length > 0){
          setErrors(val)
          setUser(newUser)
          return
        }
        if(edit){
          const index = users.findIndex(u=>u.id === user.id)
          users[index] = {...users[index],...newUser}
          setUsers([...users])
          setModify(false)
          setUser(null)
          setErrors([])
          return
        }
        setUsers([newUser,...users])
        setUser(null)
        setErrors([])
        form.reset()
      }
      return (
      <>
        <h2>{edit && user ?  `Editar Usuario '${user.id}': ${user.name}` : 'Crear usuario'}</h2>
        {edit ? <button className='remove' onClick={()=>{setUser(null);setModify(false);setErrors([])}}>Cancelar</button> : null}
        <form onSubmit={formSubmit}>

          <label htmlFor="name">Nombre</label>
          <input type="text" name='name' placeholder="Juan Perez" defaultValue={user ? user.name :""} />
          <div className={errors.name ? '':'hidden min-height'}>{errors.name}</div>
          
          <label>Usuario</label>
          <input htmlFor="username" type="text" name='username' placeholder="juanpe" defaultValue={user ? user.username :""} />
          <div className={errors.username ? '':'hidden min-height'}>{errors.username}</div>
          
          <label htmlFor='email'>Email</label>
          <input type="email" name='email' placeholder="janpe@mail.com" defaultValue={user ? user.email :""} />
          <div className={errors.email ? '':'hidden min-height'}>{errors.email}</div>

          <fieldset>
            <legend>Dirección:</legend>
            
            <span>
              <div>
                <label htmlFor="street">Calle:</label>
                <input type="text" name="street" placeholder='Mcal. Lopez' defaultValue={user ? user.address.street :""}/>
              </div>
              <div className={errors.street ? '':'hidden min-height'}>{errors.street}</div>
            </span>
            
            <span>
              <div>
                <label htmlFor="suite">Suite:</label>
                <input type="text" name="suite" placeholder='Suite 454' defaultValue={user ? user.address.suite :""}/>
              </div>
              <div className={errors.suite ? '':'hidden min-height'}>{errors.suite}</div>
            </span>

            <span>
              <div>
                <label htmlFor="city">Ciudad:</label>
                <input type="text" name="city" placeholder='Asuncion' defaultValue={user ? user.address.city :""}/>
              </div>
              <div className={errors.city ? '':'hidden min-height'}>{errors.city}</div>
            </span>

            <span>
              <div>
                <label htmlFor="zipcode">Código Postal:</label>
                <input type="text" name="zipcode" placeholder='457424' defaultValue={user ? user.address.zipcode :""}/>
              </div>
              <div className={errors.zipcode ? '':'hidden min-height'}>{errors.zipcode}</div>
            </span>
            <fieldset>
              <legend>Geo:</legend>
              <span>
                <div>
                  <label htmlFor="lat">Latitud:</label>
                  <input type="text" name="lat" placeholder='-14.235' defaultValue={user ? user.address.geo.lat :""}/>
                </div>
                <div className={errors.lat ? '':'hidden min-height'}>{errors.lat}</div>
              </span>

              <span>
                <div>
                  <label htmlFor="lng">Longitud:</label>
                  <input type="text" name="lng" placeholder='-51.325' defaultValue={user ? user.address.geo.lng :""}/>
                </div>
                <div className={errors.lng ? '':'hidden min-height'}>{errors.lng}</div>
              </span>
            </fieldset>
          </fieldset>

          <label>Telefono</label>
          <input type="text" name='phone' placeholder="123456789" defaultValue={user ? user.phone :""} />
          <div className={errors.phone ? '':'hidden min-height'}>{errors.phone}</div>

          <label>Sitio Web</label>
          <input type="text" name='website' placeholder="www.tesla.com" defaultValue={user ? user.website :""} />
          <div className={errors.website ? '':'hidden min-height'}>{errors.website}</div>
          
          <fieldset>
            <legend>Compañía:</legend>
            <span>
              <div>
                <label htmlFor="company">Nombre:</label>
                <input type="text" id="company" name="cname" placeholder='Tesla' defaultValue={user ? user.company.name :""}/>
              </div>
              <div className={errors.cname ? '':'hidden min-height'}>{errors.cname}</div>
            </span>

            <span>
              <div>
                <label htmlFor="catchPhrase">Eslogan:</label>
                <input type="text" id="catchPhrase" name="catchPhrase" placeholder='The best car' defaultValue={user ? user.company.catchPhrase :""}/>
              </div>
              <div className={errors.catchPhrase ? '':'hidden min-height'}>{errors.catchPhrase}</div>
            </span>

            <span>
              <div>
                <label htmlFor="bs">Business Speak:</label>
                <input type="text" id="bs" name="bs" placeholder='The best car ever' defaultValue={user ? user.company.bs :""}/>
              </div>
              <div className={errors.bs ? '':'hidden min-height'}>{errors.bs}</div>
            </span>
          </fieldset>
          <button type='submit' className={edit ? 'btn-green':''}>{edit ? "Editar" : "Crear"}</button>
        </form>
      </>
    )}

  return (
    <>
      <h1>ABM</h1>
      {!modify && <AltaModificacion user={user} />}
      {modify && <AltaModificacion edit={true} user={user} />}
      {!modify && <Lista users={users}/>}
    </>
  )
}

export default App
