import React from "react";
import { Container, Typography, Grid, Box, IconButton } from "@mui/material";
import { Store as StoreIcon, People as PeopleIcon, Business as BusinessIcon, Info as InfoIcon } from "@mui/icons-material";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12">
      <Container maxWidth="lg">
        {/* Sección principal */}
        <Box className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <div className="text-center mb-8">
            <Typography variant="h3" className="text-4xl font-bold text-gray-800">
              Acerca de Nuestro Punto de Venta
            </Typography>
            <Typography variant="h6" className="text-xl text-gray-600 mt-4">
              Proporcionando soluciones de ventas eficientes y confiables
            </Typography>
          </div>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="text-center bg-blue-50 p-4 rounded-lg shadow-md">
                <IconButton className="text-blue-500 mb-4">
                  <StoreIcon style={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                  Tecnología de Vanguardia
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-2">
                  Nuestra plataforma está diseñada para ofrecer una experiencia de ventas fluida y profesional.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box className="text-center bg-green-50 p-4 rounded-lg shadow-md">
                <IconButton className="text-green-500 mb-4">
                  <PeopleIcon style={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                  Atención al Cliente
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-2">
                  Brindamos un soporte excepcional para nuestros clientes, asegurando una experiencia sin inconvenientes.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box className="text-center bg-orange-50 p-4 rounded-lg shadow-md">
                <IconButton className="text-orange-500 mb-4">
                  <BusinessIcon style={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                  Soluciones Empresariales
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-2">
                  Ofrecemos herramientas que se adaptan a las necesidades de tu negocio, mejorando la productividad.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box className="text-center bg-purple-50 p-4 rounded-lg shadow-md">
                <IconButton className="text-purple-500 mb-4">
                  <InfoIcon style={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                  Transparencia y Confianza
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-2">
                  Nuestra misión es ser transparentes con nuestros usuarios, siempre brindando confianza en cada transacción.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Misión y Visión */}
        <Box className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <Typography variant="h4" className="text-3xl font-bold text-gray-800 text-center mb-8">
            Nuestra Misión y Visión
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box className="text-center p-4 bg-blue-50 rounded-lg shadow-md">
                <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4">
                  Misión
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Brindar soluciones integrales en tecnología de punto de venta que optimicen el rendimiento de negocios de todas las escalas.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="text-center p-4 bg-green-50 rounded-lg shadow-md">
                <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-4">
                  Visión
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Ser la empresa líder en soluciones tecnológicas para el comercio, impulsando el éxito de nuestros clientes a nivel global.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

       
      </Container>

      
    </div>
  );
};

export default AboutPage;
