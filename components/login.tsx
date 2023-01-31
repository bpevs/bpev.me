export default function Login() {
  return (
    <form id="login" method="post" name="login" action="/api/login">
      <label for="username">Username</label>
      <input type="text" name="username" />
      <label for="password">Password</label>
      <input type="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
