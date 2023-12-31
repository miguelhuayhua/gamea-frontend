"use client";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import {
  Button,
  Col,
  Drawer,
  Form,
  List,
  Popconfirm,
  Row,
  notification,
  Typography,
} from "antd";
import { NextPage } from "next";
import { Adulto } from "../../adultos/data";
import { Caso, Seguimiento } from "../data";
import { Persona, dataPersona } from "../../personal/agregar/data";
import { createContext, useEffect, useState } from "react";
import FormularioSeguimiento from "./pdf-seguimiento";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Hijo } from "../../hijos/data";
import { AiOutlineFilePdf } from "react-icons/ai";
export const DataContext = createContext({});
import "./estilos.scss";
import { Usuario } from "../../usuarios/data";
import dayjs from "dayjs";
import parse from 'html-react-parser';
import { EditorState, } from 'draft-js';
import dynamic from 'next/dynamic';
import 'draft-js/dist/Draft.css'; // Importa los estilos de Draft.js
const DynamicEditor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false }
);
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from "draft-js-export-html";
interface Props {
  caso: Caso;
  adulto: Adulto;
  seguimiento: Seguimiento;
  setSeguimiento: any;
  persona: Persona;
  usuario: Usuario;
}

interface Props {
  caso: Caso;
  adulto: Adulto;
  seguimiento: Seguimiento;
  setSeguimiento: any;
  persona: Persona;
  usuario: Usuario;
}
const SeguimientoOptions: NextPage<Props> = (props) => {
  const [editorState, setEditorState] = useState(
    () => {
      return EditorState.createEmpty();
    }
  );
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  //cambio del estado de caso

  const getData = () => {
    axios
      .post<Seguimiento[]>(process.env.BACKEND_URL + "/caso/seguimiento/all", {
        id_caso: params.get('id_caso')
      })
      .then((res) => {
        setSeguimientos(res.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24} xl={{ span: 12 }}>
          <div className="detalle-seguimiento">
            <p style={{ textAlign: "start", display: "flex", flexDirection: 'column' }}>
              <b className="fw-bold">
                Fecha de seguimiento: </b>
              {dayjs(props.seguimiento.fecha_seguimiento).format('DD/MM/YYYY')}
              <br />
              <b className="fw-bold">
                Adulto mayor implicado: </b>
              {props.adulto.nombre +
                " " +
                props.adulto.paterno +
                " " +
                props.adulto.materno}
            </p>
          </div>
          <Form>
            <Col span={24} className="my-3">
              <b className="fw-bold">
                Detalles seguimiento</b>
              <DynamicEditor
                editorState={editorState}
                editorStyle={{ border: '1px solid #DDD', borderRadius: 5 }}
                onEditorStateChange={setEditorState}
                toolbar={{
                  options: ['inline', 'history', 'list'],  // Agregamos 'list' a las opciones del toolbar
                  inline: {
                    options: ['bold', 'italic'], // Agregamos las opciones de lista
                  },
                  list: { options: ['unordered'] }
                }}
              />
            </Col>
            <Popconfirm
              key="popconfirm"
              title="¿Estás seguro de continuar?"
              onConfirm={() => {
                notification.info({ message: "Guardando y generando...", duration: 10 });
                axios
                  .post(process.env.BACKEND_URL + "/caso/seguimiento/add", {
                    ...props.seguimiento,
                    detalle_seguimiento: stateToHTML(editorState.getCurrentContent()),
                    id_caso: props.caso.id_caso,
                    usuario: props.usuario
                  })
                  .then((res) => {
                    if (res.data.status == 1) {
                      pdf(

                        <FormularioSeguimiento adulto={props.adulto}
                          caso={props.caso}
                          seguimiento={props.seguimiento}
                          persona={props.persona} />
                      )
                        .toBlob()
                        .then((blob) => {
                          notification.success({
                            message: "¡Guardado y generado con éxito!",
                            duration: 10
                          });
                          getData();
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          let { nombre, paterno, materno } = props.adulto;

                          link.setAttribute(
                            "download",
                            nombre +
                            paterno +
                            materno +
                            props.seguimiento.fecha_seguimiento +
                            ".pdf"
                          );
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                    }
                  });
              }}
              okText="Sí"
              cancelText="No"
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: 20 }}
              >
                Guardar y generar
              </Button>
            </Popconfirm>
            <Button
              style={{ marginTop: 20, marginLeft: 20 }}
              onClick={() => {
                setOpen(true);
                props.setSeguimiento({ ...props.seguimiento, detalle_seguimiento: stateToHTML(editorState.getCurrentContent()) });
              }}
            >
              Vista Previa PDF
            </Button>
          </Form>
        </Col>
        <Col span={24} xl={{ span: 12 }}>
          <List
            header={<b>Historial de seguimientos</b>}
            pagination={{
              defaultPageSize: 8,
              size: "small",
              pageSize: 8,
              position: "bottom",
              align: "center",
            }}
            dataSource={seguimientos}
            rowKey={(seguimiento) => seguimiento.id_seguimiento}
            renderItem={(item, index) => (
              <List.Item>
                <>
                  <p style={{ fontSize: 11, }}>
                    <b className="fw-bold">Fecha y hora: </b>
                    <br />
                    {item.fecha_seguimiento + " " + item.hora_seguimiento}
                  </p>

                  <Typography.Paragraph
                    ellipsis={{
                      rows: 3,
                      expandable: true,
                      symbol: "Expandir",
                    }}
                    style={{ fontSize: 11 }}
                  >
                    <b className="fw-bold">Detalles: </b>
                    {parse(item.detalle_seguimiento)};
                  </Typography.Paragraph>
                  <Button
                    onClick={() => {
                      let caso: any = {};
                      axios
                        .post<Caso>(process.env.BACKEND_URL + "/caso/get", {
                          id_caso: props.caso.id_caso,
                        })
                        .then((res) => {
                          caso = res.data;
                          axios
                            .post<{ adulto: Adulto; hijos: Hijo[] }>(
                              process.env.BACKEND_URL + "/adulto/get",
                              {
                                id_adulto: caso.id_adulto,
                              }
                            )
                            .then((res) => {
                              pdf(
                                <FormularioSeguimiento adulto={res.data.adulto}
                                  caso={props.caso}
                                  seguimiento={item}
                                  persona={props.persona} />
                              )
                                .toBlob()
                                .then((blob) => {
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  let { nombre, paterno, materno } =
                                    props.adulto;

                                  link.setAttribute(
                                    "download",
                                    nombre +
                                    paterno +
                                    materno +
                                    props.seguimiento.fecha_seguimiento +
                                    ".pdf"
                                  );
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                });
                            });
                        });
                    }}
                    style={{ height: 45, margin: "0 10px" }}>
                    <AiOutlineFilePdf
                      style={{
                        color: "#b51308",
                        fontSize: 30,
                      }}
                    />
                  </Button>
                </>
              </List.Item>
            )}
          ></List>
        </Col>
      </Row>
      <Drawer
        title={`Vista previa del Documento`}
        placement="right"
        size={"large"}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <PDFViewer showToolbar={false} style={{ width: "100%", height: 650 }}>
          <FormularioSeguimiento adulto={props.adulto}
            caso={props.caso}
            seguimiento={props.seguimiento}
            persona={props.persona} />
        </PDFViewer>
      </Drawer>
    </>
  );
};

export default SeguimientoOptions;
