import React from "react";
import firebase from "../../firebase";
import md5 from "md5";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

function Register() {
  const [state, setState] = React.useState({
    username: "hello",
    email: "test@t.com",
    password: "123456",
    passwordConfirmation: "123456",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users")
  });
  const isFormValid = () => {
    let errors = [];
    let error;

    if (isFormEmpty(state)) {
      error = { message: "Fill in all fields" };
      setState({ ...state, errors: errors.concat(error) });
      return false;
    } else if (!isPasswordValid(state)) {
      error = { message: "Password is invalid" };
      setState({ ...state, errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  function handleChange(event) {
    setState({ ...state, [event.target.name]: event.target.value });
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (isFormValid()) {
      setState({ ...state, errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(state.email, state.password)
        .then(createdUser => {
          setState({ ...state, loading: false });
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log("user saved");
              });
            })
            .catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          setState({
            ...state,
            errors: state.errors.concat(err),
            loading: false
          });
          console.log(err);
        });
    }
  }

  const saveUser = createdUser => {
    return state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  const handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
              value={state.username}
              type="text"
            />

            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleChange}
              value={state.email}
              className={handleInputError(state.errors, "email")}
              type="email"
            />

            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
              value={state.password}
              type="password"
            />

            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={handleChange}
              value={state.passwordConfirmation}
              type="password"
            />

            <Button
              disabled={state.loading}
              className={state.loading ? "loading" : ""}
              color="orange"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {state.errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(state.errors)}
          </Message>
        )}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

export default Register;
