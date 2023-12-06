import React, { useContext } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
  Svg,
  Line,
} from "@react-pdf/renderer";
import { DataContext } from "./caso";

import {
  AdultoMayor2,
  DatosDenuncia,
  DatosDenunciado,
  DatosUbicacion,
} from "../nuevocaso/data";
import { Persona } from "../../personal/agregar/data";
import dayjs from "dayjs";
import HTMLReactParser from "html-react-parser";
//estilos
const styles = StyleSheet.create({
  textItalic: { fontSize: 9, fontFamily: "Helvetica-Oblique" },
  title: {
    width: "100%",
    textAlign: "center",
    marginTop: 10,
  },
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 20,
    position: "relative",
    paddingBottom: 25,
  },
  signatureBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 9,
    justifyContent: "center",
    marginTop: 80,
  },
  container: {
    width: "100%",
    border: "1px solid black",
    borderRadius: "5px",
    padding: 10,
  },
  textContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    border: "1px solid black",
    borderRadius: 2,
    fontSize: 9,
  },
  checker: {
    width: 10,
    height: 10,
    margin: 5,
    border: "1px solid black",
    borderRadius: 2.5,
    fontSize: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    color: "#000",
  },
  textInfo: { width: "33%", color: "#999", textAlign: "center", fontSize: 8 },

  horizontal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 9,
  },
  textBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },

  textCenter: {
    textAlign: "center",
  },
  textEnd: {
    textAlign: "right",
  },
  parraf: {
    lineHeight: 1.3,
    fontFamily: "Helvetica",
    fontSize: 12,
    marginTop: 12,
  },
  listItem: {
    marginLeft: 40,
  },
});

// Create Document Component
const Formulario = () => {
  const data = useContext(DataContext);
  let {
    datosGenerales,
    datosUbicacion,
    descripcionHechos,
    descripcionPeticion,
    datosDenunciado,
    accionRealizada,
    datosDenuncia,
  } = data as {
    datosGenerales: AdultoMayor2;
    datosUbicacion: DatosUbicacion;
    descripcionHechos: string;
    descripcionPeticion: string;
    datosDenunciado: DatosDenunciado;
    accionRealizada: string;
    datosDenuncia: DatosDenuncia;
  };
  let accionesRealizadas = accionRealizada.split("/");
  let descripcion: any[] = [];
  let peticion: any[] = [];
  const parseToHtml = (text: string) => {
    let list: any[] = [];
    HTMLReactParser(text, {
      transform(node, dom: any, index) {
        if (dom.type == 'text' && dom.parent.name == 'p') {
          list.push(<Text key={dom.type + '-' + index} style={styles.text}>{dom.data}</Text>);
        }
        else if (dom.type == 'text' && dom.parent.name != 'p' || dom.name == 'p') {
          return null;
        }
        else {
          if (dom.name == 'strong' && dom.parent != 'em') {
            list.push(<Text key={dom.type + '-' + index} style={styles.textBold}>
              {dom.children[0].data}
            </Text>);
          }
          else if (dom.name == 'strong' && dom.parent == 'em') {
            return null;
          }
          else {
            if (dom.children[0].type == 'text') {
              list.push(<Text key={dom.type + '-' + index} style={styles.textItalic}>
                {dom.children[0].data}
              </Text>);
            }
            else {
              list.push(<Text key={dom.type + '-' + index} style={{ ...styles.textItalic, ...styles.textBold }}>
                {dom.children[0].children[0].data}
              </Text>);
            }
          }
        }
      }

    });
    return list;
  }
  descripcion = parseToHtml(descripcionHechos);
  peticion = parseToHtml(descripcionPeticion);

  let { persona } = data as { persona: Persona };
  return (
    <Document>
      <Page style={styles.page}>
        <Text
          style={{
            position: "absolute",
            top: 8,
            right: 20,
            color: "gray",
            fontSize: 8,
          }}
        >
          Generado por:
          {`${persona.nombres} ${persona.paterno} ${persona.materno}`}
        </Text>
        <Image
          style={{
            width: 80,
            height: 50,
            position: "absolute",
            top: 20,
            right: 2,
          }}
          src={"/assets/logo-gamea.png"}
        ></Image>

        <Image
          style={{
            width: 80,
            height: 50,
            position: "absolute",
            top: 20,
            left: 2,
          }}
          src={"/assets/logo-elalto.png"}
        ></Image>
        <Text
          style={{ ...styles.textBold, ...styles.textCenter, fontSize: 10 }}
        >
          GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO
        </Text>
        <Svg height="3" width="600">
          <Line
            x1="90"
            y1="2"
            x2="470"
            y2="2"
            strokeWidth={1}
            stroke="rgb(0,0,0)"
          />
        </Svg>
        <Text
          style={{ ...styles.textBold, ...styles.textCenter, fontSize: 10 }}
        >
          SECRETARÍA MUNICIPAL DE DESARROLLO HUMANO Y SOCIAL INTEGRAL
        </Text>
        <Text
          style={{ ...styles.textBold, ...styles.textCenter, fontSize: 10 }}
        >
          DIRECCCIÓN DE DESARROLLO INTEGRAL UNIDAD DE ADULTOS MAYORES
        </Text>
        <Text
          style={{ ...styles.textBold, ...styles.textCenter, fontSize: 10 }}
        >
          PROGRAMA: DEFENSA Y RESTITUCIÓN DE DERECHOS DEL ADULTO MAYOR
        </Text>
        <View style={{ ...styles.horizontal, marginTop: 9 }}>
          <Text style={styles.textInfo}>
            {"Fecha y hora de registro: " +
              datosDenuncia.fecha_registro +
              " " +
              datosDenuncia.hora_registro}
          </Text>
          <Text style={styles.textInfo}>
            {"Tipología: " + datosDenuncia.tipologia}
          </Text>
          <Text style={styles.textInfo}>
            {"N° de caso: " + datosDenuncia.nro_caso + "/" + dayjs().year()}
          </Text>
        </View>
        <Text style={{ ...styles.textBold, marginTop: 15, marginBottom: 2.5 }}>
          I. DATOS GENERALES DE LA PERSONA ADULTA MAYOR
        </Text>
        <View style={styles.container}>
          <Text style={styles.textBold}>NOMBRES Y APELLIDOS: </Text>
          <Text style={{ ...styles.textContainer, fontSize: 9 }}>
            {datosGenerales.nombre +
              " " +
              datosGenerales.paterno +
              " " +
              datosGenerales.materno}
          </Text>
          <View style={{ ...styles.horizontal, marginTop: 2 }}>
            <View style={{ width: "50%", ...styles.horizontal }}>
              <Text style={styles.textBold}>GÉNERO:</Text>
              <Text style={styles.text}>FEMENINO</Text>
              <Text style={styles.checker}>
                {datosGenerales.genero == "Femenino" ? "X" : ""}
              </Text>
              <Text style={styles.text}> MASCULINO</Text>
              <Text style={styles.checker}>
                {datosGenerales.genero == "Masculino" ? "X" : ""}
              </Text>
            </View>
            <View style={{ width: "25%", ...styles.horizontal }}>
              <Text style={styles.textBold}>EDAD: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosGenerales.edad}
              </Text>
            </View>
            <View style={{ width: "25%", ...styles.horizontal }}>
              <Text style={styles.textBold}>N° C.I.: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosGenerales.ci}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.horizontal, marginTop: 2 }}>
            <View style={{ width: "50%", ...styles.horizontal }}>
              <Text style={styles.textBold}>FECHA DE NACIMIENTO: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosGenerales.f_nacimiento}
              </Text>
            </View>
            <View style={{ width: "50%", ...styles.horizontal }}>
              <Text style={styles.textBold}>NRO. DE REFERENCIA: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosGenerales.nro_referencia}
              </Text>
            </View>
          </View>
          <View style={{ width: "100%", marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>ESTADO CIVIL:</Text>
            <Text style={styles.text}>SOLTERO(A)</Text>
            <Text style={styles.checker}>
              {datosGenerales.estado_civil == "Soltero(a)" ? "X" : ""}
            </Text>

            <Text style={styles.text}> CASADO(A)</Text>
            <Text style={styles.checker}>
              {datosGenerales.estado_civil == "Casado(a)" ? "X" : ""}
            </Text>

            <Text style={styles.text}> CONCUBINO(A)</Text>
            <Text style={styles.checker}>
              {datosGenerales.estado_civil == "Concubino(a)" ? "X" : ""}
            </Text>
            <Text style={styles.text}> DIVORCIADO(A)</Text>
            <Text style={styles.checker}>
              {datosGenerales.estado_civil == "Divorciado(a)" ? "X" : ""}
            </Text>
            <Text style={styles.text}> VIUDO(A)</Text>
            <Text style={styles.checker}>
              {datosGenerales.estado_civil == "Viudo(a)" ? "X" : ""}
            </Text>
          </View>
          <View style={{ width: "50%", marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>N° Y NOMBRE DE HIJOS: </Text>
            <Text style={{ ...styles.textContainer, fontSize: 9 }}>
              {datosGenerales.hijos.length + " hijos(as). "}
              {datosGenerales.hijos.map((hijo, i) => {
                return i < datosGenerales.hijos.length
                  ? hijo.nombres_apellidos + ","
                  : hijo.nombres_apellidos + ". ";
              })}
            </Text>
          </View>
          <View style={{ width: "100%", marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>GRADO DE INSTRUCCIÓN: </Text>
            <Text style={styles.text}>PRIMARIA</Text>
            <Text style={styles.checker}>
              {datosGenerales.grado == "Primaria" ? "X" : ""}
            </Text>

            <Text style={styles.text}> SECUNDARIA </Text>
            <Text style={styles.checker}>
              {datosGenerales.grado == "Secundaria" ? "X" : ""}
            </Text>

            <Text style={styles.text}> TÉCNICO </Text>
            <Text style={styles.checker}>
              {datosGenerales.grado == "Tecnico" ? "X" : ""}
            </Text>

            <Text style={styles.text}> UNIVERSITARIO </Text>
            <Text style={styles.checker}>
              {datosGenerales.grado == "Universitario" ? "X" : ""}
            </Text>

            <Text style={styles.text}> SIN INSTRUCCIÓN </Text>
            <Text style={styles.checker}>
              {datosGenerales.grado == "S/Inst." ? "X" : ""}
            </Text>
          </View>
          <View style={{ ...styles.horizontal, marginTop: 0 }}>
            <View style={{ width: "30%", ...styles.horizontal }}>
              <Text style={styles.textBold}>OCUPACIÓN: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosGenerales.ocupacion}
              </Text>
            </View>
            <View style={{ width: "70%", ...styles.horizontal }}>
              <Text style={styles.textBold}>BENEFICIOS: </Text>
              <Text style={styles.text}>RENTA DIGNIDAD</Text>
              <Text style={styles.checker}>
                {datosGenerales.beneficios == "Renta Dignidad" ? "X" : ""}
              </Text>

              <Text style={styles.text}> JUBILADO </Text>
              <Text style={styles.checker}>
                {datosGenerales.beneficios == "Jubilado" ? "X" : ""}
              </Text>

              <Text style={styles.text}> NINGUNO </Text>
              <Text style={styles.checker}>
                {datosGenerales.beneficios == "Ninguno" ? "X" : ""}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>DOMICILIO: </Text>
            <Text style={styles.text}> PROPIO </Text>
            <Text style={styles.checker}>
              {datosUbicacion.tipo_domicilio == "Propio" ? "X" : ""}
            </Text>

            <Text style={styles.text}> ALQUILADO </Text>
            <Text style={styles.checker}>
              {datosUbicacion.tipo_domicilio == "Alquilado" ? "X" : ""}
            </Text>

            <Text style={styles.text}> ANTICRÉTICO </Text>
            <Text style={styles.checker}>
              {datosUbicacion.tipo_domicilio == "Anticretico" ? "X" : ""}
            </Text>

            <Text style={styles.text}> CEDIDO </Text>
            <Text style={styles.checker}>
              {datosUbicacion.tipo_domicilio == "Cedido" ? "X" : ""}
            </Text>

            <Text style={styles.text}> OTRO </Text>
            <Text style={styles.checker}>
              {datosUbicacion.tipo_domicilio == "Otro" ? "X" : ""}
            </Text>

            {datosUbicacion.tipo_domicilio == "Otro" ? (
              <Text style={{ ...styles.textContainer }}>
                {datosUbicacion.otro_domicilio}
              </Text>
            ) : (
              <></>
            )}
          </View>

          <View style={{ ...styles.horizontal, marginTop: 0 }}>
            <Text style={styles.textBold}>DISTRITO: </Text>
            <Text style={{ ...styles.textContainer }}>
              {datosUbicacion.distrito}
            </Text>
            <Text style={{ ...styles.textBold, marginLeft: 5 }}>ZONA: </Text>
            <Text style={{ ...styles.textContainer }}>
              {datosUbicacion.zona}
            </Text>
            <Text style={{ ...styles.textBold, marginLeft: 5 }}>
              CALLE O AV.:{" "}
            </Text>
            <Text style={{ ...styles.textContainer }}>
              {datosUbicacion.calle_av}
            </Text>
            <Text style={{ ...styles.textBold, marginLeft: 5 }}>N°: </Text>
            <Text style={{ ...styles.textContainer }}>
              {datosUbicacion.nro_vivienda}
            </Text>
          </View>
          <View style={{ marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>AREA: </Text>
            <Text style={styles.text}>URBANO</Text>
            <Text style={styles.checker}>
              {datosUbicacion.area == "Urbano" ? "X" : ""}
            </Text>
            <Text style={styles.text}> RURAL </Text>
            <Text style={styles.checker}>
              {datosUbicacion.area == "Rural" ? "X" : ""}
            </Text>
            <Text style={styles.text}> OTRO </Text>
            <Text style={styles.checker}>
              {datosUbicacion.area == "Otro" ? "X" : ""}
            </Text>
            {datosUbicacion.area == "Otro" ? (
              <Text style={{ ...styles.textContainer }}>
                {datosUbicacion.otra_area}
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>
        <Text style={{ ...styles.textBold, marginTop: 5, marginBottom: 2 }}>
          II. DESCRIPCIÓN DE LOS HECHOS
        </Text>
        <View style={styles.container}>
          <Text style={styles.text}>
            {descripcion}
          </Text>
        </View>
        <Text style={{ ...styles.textBold, marginTop: 5, marginBottom: 2 }}>
          III. PETICIÓN DE LA PERSONA ADULTA MAYOR
        </Text>
        <View style={styles.container}>
          <Text style={styles.text}>
            {peticion}
          </Text>
        </View>
        <Text style={{ ...styles.textBold, marginTop: 5, marginBottom: 2 }}>
          IV. DATOS PERSONALES DEL DENUNCIADO(A)
        </Text>
        <View style={styles.container}>
          <View style={{ ...styles.horizontal, marginTop: 2 }}>
            <View style={{ width: "100%", ...styles.horizontal }}>
              <Text style={styles.textBold}>NOMBRES Y APELLIDOS: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosDenunciado.nombres +
                  " " +
                  datosDenunciado.paterno +
                  " " +
                  datosDenunciado.materno}
              </Text>
            </View>
            <View style={{ width: "100%", ...styles.horizontal }}>
              <Text style={styles.textBold}>PARENTEZCO: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {datosDenunciado.parentezco}
              </Text>
            </View>
          </View>
        </View>
        <Text style={{ ...styles.textBold, marginTop: 5, marginBottom: 2 }}>
          V. ACCIONES REALIZADAS
        </Text>
        <View style={styles.container}>
          <View style={{ width: "100%", ...styles.horizontal }}>
            <Text style={styles.text}>APERTURA </Text>
            <Text style={styles.checker}>
              {accionesRealizadas.includes("Apertura") ? "X" : ""}
            </Text>
            <Text style={styles.text}>ORIENTACIÓN </Text>
            <Text style={styles.checker}>
              {accionRealizada.includes("Orientacion") ? "X" : ""}
            </Text>
            <Text style={styles.text}>CITACIÓN </Text>
            <Text style={styles.checker}>
              {accionRealizada.includes("Citacion") ? "X" : ""}
            </Text>
            <Text style={styles.text}>DERIVACIÓN </Text>
            <Text style={styles.checker}>
              {accionRealizada.includes("Derivacion") ? "X" : ""}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.horizontal,
            marginTop: 90,
            marginLeft: 50
          }}
        >
          <Text style={{ ...styles.text, ...styles.textCenter }}>
            {`FIRMA O HUELLA DEL ADULTO(A) MAYOR \n ${datosGenerales.nombre} ${datosGenerales.paterno} ${datosGenerales.materno}`}
          </Text>
        </View>

        <Image
          style={{
            width: "90%",
            height: "auto",
            position: "absolute",
            bottom: 10,
            left: "9%",
          }}
          fixed
          src={"/assets/footer-pdf.jpg"}
        ></Image>
      </Page>
    </Document>
  );
};
export default Formulario;
