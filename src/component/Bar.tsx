// src\component\Bar.tsx
import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  AppBar, Avatar, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, Box
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import "@component/bar.scss";
import { contextStore } from "@component/ContextStore";

const PAGES = [{ key: "games", route: "/admin" }];
const SETTINGS = [{ key: "logout", action: "logout" }];

function Bar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const context = contextStore();
  const reset = contextStore((state) => state.reset);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleMenuOpen = useCallback((setAnchor: Function) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback((setAnchor: Function, action?: string, route?: string) => () => {
    setAnchor(null);
    if (route) navigate(route);
    if (action === "logout") reset();
  }, [navigate, reset]);

  const avatarLabel = useMemo(() => context.code?.substring(0, 3) || "", [context.code]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Title */}
          <Typography variant="h6" noWrap sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
            <Link to="/admin" className="lilith">Lilith</Link>
          </Typography>

          {/* Mobile Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" aria-label="menu" color="inherit" onClick={handleMenuOpen(setAnchorElNav)}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleMenuClose(setAnchorElNav)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              keepMounted
            >
              {PAGES.map(({ key, route }) => (
                <MenuItem key={key} onClick={handleMenuClose(setAnchorElNav, undefined, route)}>
                  <Typography textAlign="center"><Trans>bar.{key}</Trans></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Title */}
          <Typography variant="h5" noWrap sx={{ mr: 2, flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Link to="/admin" className="lilith">Lilith</Link>
          </Typography>

          {/* Desktop Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {PAGES.map(({ key, route }) => (
              <Button key={key} onClick={handleMenuClose(setAnchorElNav, undefined, route)} sx={{ my: 2, color: "white" }}>
                <Trans>bar.{key}</Trans>
              </Button>
            ))}
          </Box>

          {/* User Settings Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={ t('bar.settings')}>
              <IconButton onClick={handleMenuOpen(setAnchorElUser)} sx={{ p: 0 }}>
                <Avatar alt={avatarLabel}>{avatarLabel}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleMenuClose(setAnchorElUser)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              sx={{ mt: "45px" }}
            >
              {SETTINGS.map(({ key, action }) => (
                <MenuItem key={key} onClick={handleMenuClose(setAnchorElUser, action)}>
                  <Typography textAlign="center"><Trans>bar.{key}</Trans></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Bar;
