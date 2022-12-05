export function isLoggedIn(): boolean {
  console.log(`isLoggedIn(): cookie: ${document.cookie}`);
  return document.cookie != null;
}
