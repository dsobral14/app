import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  Fade,
  Grow,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    background: `linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)",
      animation: "pulse 15s infinite",
    },
  },
  container: {
    position: "relative",
    zIndex: 1,
  },
  formBox: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    padding: theme.spacing(4),
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(65, 22, 22, 0.3)",
    maxWidth: "400px",
    width: "100%",
    animation: "float 3s ease-in-out infinite",
  },
  title: {
    color: theme.palette.primary.dark,
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    textAlign: "center",
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  form: {
    width: "100%",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      transition: "all 0.3s",
      "&:hover": {
        boxShadow: "0 0 15px rgba(22, 13, 3, 0.3)",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 20px rgba(20, 20, 19, 0.5)",
      },
    },
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    borderRadius: "12px",
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1.1rem",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 8px 25px rgba(19, 18, 18, 0.4)",
    },
  },
  loadingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "4px",
    "& .MuiLinearProgress-bar": {
      background: "rgba(255, 255, 255, 0.8)",
    },
  },
  sentAnimation: {
    position: "relative",
    background: "linear-gradient(45deg, #4caf50, #81c784)",
    "&:after": {
      content: '"✉️"',
      position: "absolute",
      fontSize: "24px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      animation: "flyAway 1s ease-out forwards",
    },
  },
  link: {
    color: theme.palette.grey[700],
    textDecoration: "none",
    transition: "all 0.3s",
    "&:hover": {
      color: "#0d120f",
      transform: "translateX(5px)",
    },
  },
  errorText: {
    color: theme.palette.error.main,
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
  "@keyframes pulse": {
    "0%, 100%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.1)" },
  },
  "@keyframes flyAway": {
    "0%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
    "100%": { transform: "translate(-50%, -150%) scale(0.5)", opacity: 0 },
  },
}));

const RedefinirSenha = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const token = new URLSearchParams(location.search).get("token");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setVisivel(true);
    if (!token) {
      setError("Token de redefinição ausente ou inválido. Por favor, solicite um novo link de redefinição.");
      console.error("No token found in URL:", location.search);
    } else {
      console.log("Token extracted from URL:", token);
    }
  }, [token, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      setError("As senhas não coincidem");
      return;
    }
    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setEnviando(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: senha,
      });
      setEnviando(false);
      setEnviado(true);
      toast.success("Senha redefinida com sucesso");
      setTimeout(() => {
        setEnviado(false);
        history.push("/login");
      }, 2000);
    } catch (err) {
      setEnviando(false);
      const errorMessage = err.response?.data?.message || "Erro ao redefinir senha. Tente novamente.";
      setError(errorMessage);
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Fade in={visivel} timeout={1000}>
        <Container className={classes.container} maxWidth="xs">
          <Grow in={visivel} timeout={1200}>
            <Box className={classes.formBox}>
              <Typography variant="h4" className={classes.title}>
                Redefinir Senha
              </Typography>
              {error && (
                <Typography className={classes.errorText}>
                  {error}
                </Typography>
              )}
              {!error && (
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="senha"
                    label="Nova Senha"
                    type="password"
                    id="senha"
                    autoComplete="new-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={classes.textField}
                    disabled={enviando || enviado}
                  />
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmarSenha"
                    label="Confirmar Senha"
                    type="password"
                    id="confirmarSenha"
                    autoComplete="new-password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className={classes.textField}
                    disabled={enviando || enviado}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={`${classes.submitButton} ${enviado ? classes.sentAnimation : ""}`}
                    disabled={enviando || enviado || !token}
                  >
                    {enviando
                      ? "Redefinindo..."
                      : enviado
                      ? "Redefinido!"
                      : "Redefinir Senha"}
                    {enviando && <LinearProgress className={classes.loadingBar} />}
                  </Button>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Link component={RouterLink} to="/login" className={classes.link}>
                        Voltar ao Login
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Box>
          </Grow>
        </Container>
      </Fade>
    </div>
  );
};

export default RedefinirSenha;
