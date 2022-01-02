import React from "react";
import "./auth.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Input, DatePicker, Select } from "antd";
const { Option } = Select;

const listAvatar = [
  { id: 1, url: "https://bootdey.com/img/Content/avatar/avatar1.png" },
  { id: 2, url: "https://bootdey.com/img/Content/avatar/avatar2.png" },
  { id: 3, url: "https://bootdey.com/img/Content/avatar/avatar3.png" },
  { id: 4, url: "https://bootdey.com/img/Content/avatar/avatar4.png" },
  { id: 5, url: "https://bootdey.com/img/Content/avatar/avatar5.png" },
  { id: 6, url: "https://bootdey.com/img/Content/avatar/avatar6.png" },
  { id: 7, url: "https://bootdey.com/img/Content/avatar/avatar7.png" },
  { id: 8, url: "https://bootdey.com/img/Content/avatar/avatar8.png" },
];

const SignUp = () => {
  const navigate = useNavigate();

  const randomAvatar = () => {
    return listAvatar[Math.floor(Math.random() * listAvatar.length)].url;
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      dateOfBirth: values["dateOfBirth"].format("DD/MM/YYYY"),
      urlImage: randomAvatar(),
    };
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const currentUser = auth.currentUser;
        const name = payload.name;
        currentUser.displayName = name;
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: payload.name,
          dateOfBirth: payload.dateOfBirth,
          gender: payload.gender,
          email: payload.email,
          isOnline: true,
          isChat: false,
          urlImage: payload.urlImage,
        }).then(() => {
          navigate("/sign-in");
        });
      })
      .catch((error) => {
        toast(`Email ${payload.email} has been used!`);
      });
  };

  return (
    <div className="container form-login">
      <h1>Sign up</h1>
      <Form
        name="normal_login"
        className="login-form mt-4"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="name"
          hasFeedback
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="dateOfBirth"
          rules={[{ required: true, message: "Please input your birthday!" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="Select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          hasFeedback
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Email is invalid!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[
            { required: true, message: "Please input your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && value.length < 6) {
                  return Promise.reject(
                    new Error("Password must be at least 6 characters!")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Password do not match!"));
              },
            }),
          ]}
        >
          <Input type="password" placeholder="Confirm password" />
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
      <div className="mt-2 pr-2">
        Do you already have an account?
        <Link to="/sign-in" className="text-primary">
          {" "}
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
