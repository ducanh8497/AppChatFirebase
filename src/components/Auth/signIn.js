import React from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signin,
  signInWithFacebook,
  signInWithGoogle,
} from "../../redux/actions/user";
import { Button, Form, Input } from "antd";

const SignIn = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const signInGoogle = () => {
    dispatch(signInWithGoogle());
  };

  const signInFacebook = () => {
    dispatch(signInWithFacebook());
  };

  const onFinish = (values) => {
    dispatch(signin(values));
  };

  if (user?.authenticated) return <Navigate to="/" />;

  return (
    <div className="container form-login">
      <h1>Sign in</h1>
      <Button danger onClick={signInGoogle}>
        Google
      </Button>
      <Button className="btn-fb" type="primary" onClick={signInFacebook}>
        Facebook
      </Button>
      <hr />
      <Form
        name="normal_login"
        className="login-form mt-4"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button w-100 text-uppercase"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <div className="pr-2">
        Do not have an account?
        <Link to="/sign-up" className="text-primary">
          {" "}
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
