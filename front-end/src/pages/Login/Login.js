import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, Controller  } from "react-hook-form";
import request from '../../api/request';
import useAuth from '../../hooks/useAuth';

export default function Login() {
    const { 
        resetField,
        formState: { errors },
        control,
        handleSubmit } = useForm(
            {
                defaultValues: {
                    email: '',
                    password: '',
                },
            },
        );
    
    const { login } = useAuth(); 
    const [searchParams] = useSearchParams();

    const onSubmit = async (values) => {
        const { email, password } = values;
        try {
            const res = await request({
                url: '/api/auth/login',
                method: 'POST',
                data: { username: email, password: password }
            })
            if (res.success) {
                login({
                    token: res.data.token,
                    returnUrl: searchParams.get('returnUrl') ?? ''
                })
            }
        } catch (err) {
            resetField();
            alert(err.message);
        }
    };

    return (
        <div>
            <Container fluid style={{padding: "10px 0", height: "90px"}}>
                <Row className="nav__header nav-dropdown__header">
                    <Col md={2} style={{maxHeight: "100%"}}>
                        <a href="/">
                            <img  style={{maxHeight: "72px"}} src="https://c3.mediawz.com/wp-content/uploads/2021/06/logo-c3-1.png" alt="1"/>
                        </a>
                    </Col>
                </Row>
            </Container>

            <div style={{display: "flex", background: "#ee4d2d", height: "calc(100vh - 84px - 32px)"}}>
                <Form 
                    style={{ width: "30vw", maxWidth: "400px", minWidth: "280px", maxHeight: "600px", minHeight: "450px", padding: "30px 30px", background: "#ffffff", borderRadius: "4px", boxShadow: "0 3px 10px 0 rgb(0 0 0 / 14%)", margin: "auto"}}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div style={{ color: "#222", fontSize: "1.25rem", fontWeight: "500", textAlign: "center"}}>Đăng nhập</div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ marginTop: "24px"}}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Form.Control type="email" placeholder="Email" {...field}/>
                            )}
                        />
                        {errors?.email?.type === 'required' && <p role="alert">Username không được để trống</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" style={{ marginTop: "20px"}}>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Form.Control type="password" placeholder="Mật khẩu" {...field}/>
                            )}
                        />
                        {errors?.password?.type === 'required' && <p role="alert">Password không được để trống</p>}
                    </Form.Group>
                    <Button variant="danger" type="submit" style={{ width: "100%", marginTop: "8px" }}>Đăng nhập</Button>
                        <p style={{ margin: "0px 0px"}}><a style={{color: "blue"}}>Quên mật khẩu</a></p>
                        <p style={{ margin: "0px 0px"}}><Link to="/signup" style={{color: "blue"}}>Đăng ký tài khoản</Link></p>
                    <p style={{ textAlign: "center", fontSize: "1.1rem", margin: "8px 0px"}}>Hoặc đăng nhập với</p>
                    <div style={{ width: "100%", textAlign: "center"}}>
                            <button style={{border: "1px solid rgba(0,0,0,.26)", color: "rgba(0,0,0,.87)", borderRadius: "2px", height: "40px", width: "80%", minWidth: "200px"}}><img style={{ marginRight: "8px", height: "100%" }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/150px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook"/>Facebook</button>
                            <button style={{border: "1px solid rgba(0,0,0,.26)", color: "rgba(0,0,0,.87)", borderRadius: "2px", height: "40px", width: "80%", minWidth: "200px", marginTop: "4px"}}><img style={{ marginRight: "8px", height: "100%" }} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google"/>Google</button>
                    </div>
                </Form>
            </div>

            <footer style={{background: "#ffffff", height: "32px", color: "#222", textAlign: "center", fontWeight: "500", alignSelf: "end"}}>2022</footer>
        </div>
    )
}