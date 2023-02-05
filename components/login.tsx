export default function Login() {
  return (
    <form id='login' method='post' name='login' action='/api/login'>
      <label for='password'>Password</label>
      <input type='password' name='password' />
      <button
        type='submit'
        style={{
          padding: '0.5rem',
          borderRadius: '0.25rem',
          fontSize: '16px',
          borderStyle: 'none',
        }}
      >
        Login
      </button>
    </form>
  )
}
