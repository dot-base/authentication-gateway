# Notes

In order to use the validate and renew endpoint, you need to use the session
cookie provided by the login endpoint: 

Take the "Set-Cookie:"  response header given by login and use it as
"Cookie:" header (remove "Set-") for the validate and renew endpoints.
