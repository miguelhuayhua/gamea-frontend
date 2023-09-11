"use client";
import { Layout } from "antd";
import "moment/locale/es";
import { Content } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
//estilos
import "./estilos.scss";
//env
import dotenv from "dotenv";
dotenv.config();
import React from "react";
import MenuSider from "../components/MenuSider";
import Navbar from "../components/Navbar";
import Informacion from "./components/informacion";
import "./estilos.scss";
export default function NuevoCaso() {
  const router = useRouter();

  //cargado de casos desde la API

  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultOpenKeys={["adultos1"]}
            defaultSelectedKey="adultos1.1"
          ></MenuSider>
          <Content>
            <Navbar></Navbar>
            <Layout>
              <Content
                className="site-layout"
                style={{ padding: "0 50px", position: "relative" }}
              >
                <Informacion></Informacion>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
