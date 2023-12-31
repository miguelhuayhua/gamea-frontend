import React, { useContext } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image
} from "@react-pdf/renderer";
import {
  AdultoMayor,
  DatosDenuncia,
  DatosDenunciado,
  DatosUbicacion,
} from "../data";
import { Persona } from "@/app/dashboard/personal/agregar/data";
import dayjs from "dayjs";
import HTMLReactParser from "html-react-parser";

// Create styles
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
    padding: 20,
    position: "relative",
    paddingBottom: 25,
  },
  signatureBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    justifyContent: "center",
    marginRight: 20,
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
  },
  listItem: {
    marginLeft: 40,
  },
  textBoldItalic: { fontSize: 9, fontFamily: "Helvetica-BoldOblique" },

});

interface Props {

  datosUbicacion: DatosUbicacion;
  descripcionHechos: string;
  descripcionPeticion: string;
  datosDenunciado: DatosDenunciado;
  accionRealizada: string;
  datosGenerales: AdultoMayor;
  datosDenuncia: DatosDenuncia;
  persona: Persona;
}
// Create Document Component
const MyDocument = (props: Props) => {

  let descripcion: any[] = [];
  let peticion: any[] = [];

  const parseHtml = (text: string) => {
    let list: any[] = [];
    HTMLReactParser(text, {
      transform(node, dom: any, index) {
        if (dom.type == 'tag') {
          let listaP: any[] = [];
          if (dom.name == 'p') {
            dom.children.forEach((child: any) => {
              if (child.type == 'text') {
                listaP.push(<Text key={dom.type + index} style={styles.text} >{child.data}</Text>)
              }
              else {
                if (child.name == 'strong') {
                  listaP.push(<Text key={dom.type + index} style={styles.textBold} >{child.children[0].data}</Text>);
                }
                else if (child.name == 'em') {
                  if (child.children[0].type == 'text') {
                    listaP.push(<Text key={dom.type + index} style={styles.textItalic} >{child.children[0].data}</Text>)
                  }
                  else {
                    listaP.push(<Text key={dom.type + index} style={styles.textBoldItalic} >{child.children[0].children[0].data}</Text>)
                  }
                }
                else if (child.name == 'br') {
                  listaP.push(<Text key={dom.type + index} style={styles.text} >{"\n"}</Text>)
                }
              }
            });
            list.push(<Text style={styles.parraf}>{listaP}</Text>);
          }
          else if (dom.name == 'ul') {
            let listaLi: any[] = [];
            dom.children.forEach((child: any) => {
              if (child.type == 'tag') {
                let elemLi: any[] = [];
                elemLi.push(<Text key={dom.type + "---" + index}>{"\t• "}</Text>)
                //ENTRA EN EL CASO DE SER li
                child.children.forEach((child2: any) => {
                  //revisamos los hijos de li
                  if (child2.type == 'text') {
                    elemLi.push(<Text key={dom.type + index} style={styles.text} >{child2.data}</Text>)
                  }
                  else {
                    if (child2.name == 'strong') {
                      elemLi.push(<Text key={dom.type + index} style={styles.textBold} >{child2.children[0].data}</Text>)
                    }
                    else if (child2.name == 'em') {
                      if (child2.children[0].type == 'text') {
                        elemLi.push(<Text key={dom.type + index} style={styles.textItalic} >{child2.children[0].data}</Text>)
                      }
                      else {
                        elemLi.push(<Text key={dom.type + index} style={styles.textBoldItalic} >{child2.children[0].children[0].data}</Text>)
                      }
                    }
                  }
                });
                listaLi.push(<Text key={dom.type + "---" + index} style={styles.text}>{elemLi}</Text>)
              }
            });
            list.push(<View key={dom.type + "----" + index} style={{ marginTop: 7.5, marginBottom: 5.5, marginLeft: 18 }}>{listaLi}</View>);
          }
        }
      }
    });
    return list
  }
  descripcion = parseHtml(props.descripcionHechos);
  peticion = parseHtml(props.descripcionPeticion);

  const accionesRealizadas = props.accionRealizada.split("/");
  let persona = props.persona;
  return (
    <Document>
      <Page style={styles.page}>
        <Text
          fixed
          style={{
            position: "absolute",
            top: 8,
            right: 20,
            color: "gray",
            fontSize: 7,
          }}
        >
          Generado por:
          {`${persona.nombres} ${persona.paterno} ${persona.materno}`}
        </Text>
        <Image
        
          fixed
          style={{
            width: 550,
            height: 80,
            position: "absolute",
            top: 20,
            left: 22,
          }}
          src={"/assets/cabecera-documentos.png"}
        ></Image>
        <Text
          style={{ ...styles.textBold, ...styles.textCenter, fontSize: 10, marginTop: 60 }}
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
              props.datosDenuncia.fecha_registro +
              " " +
              props.datosDenuncia.hora_registro}
          </Text>
          <Text style={styles.textInfo}>
            {"Tipología: " + props.datosDenuncia.tipologia}
          </Text>
          <Text style={styles.textInfo}>
            {"N° de caso: " + props.datosDenuncia.nro_caso }
          </Text>
        </View>
        <Text style={{ ...styles.textBold, marginTop: 15, marginBottom: 2.5 }}>
          I. DATOS GENERALES DE LA PERSONA ADULTA MAYOR
        </Text>
        <View style={styles.container}>
          <Text style={styles.textBold}>NOMBRES Y APELLIDOS: </Text>
          <Text style={{ ...styles.textContainer, fontSize: 9 }}>
            {props.datosGenerales.nombre +
              " " +
              props.datosGenerales.paterno +
              " " +
              props.datosGenerales.materno}
          </Text>
          <View style={{ ...styles.horizontal, marginTop: 2 }}>
            <View style={{ width: "50%", ...styles.horizontal }}>
              <Text style={styles.textBold}>GÉNERO:</Text>
              <Text style={styles.text}>FEMENINO</Text>
              <Text style={styles.checker}>
                {props.datosGenerales.genero == "Femenino" ? "X" : ""}
              </Text>
              <Text style={styles.text}> MASCULINO</Text>
              <Text style={styles.checker}>
                {props.datosGenerales.genero == "Masculino" ? "X" : ""}
              </Text>
            </View>
            <View style={{ width: "25%", ...styles.horizontal }}>
              <Text style={styles.textBold}>EDAD: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosGenerales.edad}
              </Text>
            </View>
            <View style={{ width: "25%", ...styles.horizontal }}>
              <Text style={styles.textBold}>N° C.I.: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosGenerales.ci}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.horizontal, marginTop: 2 }}>
            <View style={{ width: "50%", ...styles.horizontal }}>
              <Text style={styles.textBold}>FECHA DE NACIMIENTO: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosGenerales.f_nacimiento}
              </Text>
            </View>
            <View style={{ width: "50%", ...styles.horizontal }}>
              <Text style={styles.textBold}>NRO. DE REFERENCIA: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosGenerales.nro_referencia}
              </Text>
            </View>
          </View>
          <View style={{ width: "100%", marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>ESTADO CIVIL:</Text>
            <Text style={styles.text}>SOLTERO(A)</Text>
            <Text style={styles.checker}>
              {props.datosGenerales.estado_civil == "Soltero(a)" ? "X" : ""}
            </Text>

            <Text style={styles.text}> CASADO(A)</Text>
            <Text style={styles.checker}>
              {props.datosGenerales.estado_civil == "Casado(a)" ? "X" : ""}
            </Text>

            <Text style={styles.text}> CONCUBINO(A)</Text>
            <Text style={styles.checker}>
              {props.datosGenerales.estado_civil == "Concubino(a)" ? "X" : ""}
            </Text>
            <Text style={styles.text}> DIVORCIADO(A)</Text>
            <Text style={styles.checker}>
              {props.datosGenerales.estado_civil == "Divorciado(a)" ? "X" : ""}
            </Text>
            <Text style={styles.text}> VIUDO(A)</Text>
            <Text style={styles.checker}>
              {props.datosGenerales.estado_civil == "Viudo(a)" ? "X" : ""}
            </Text>
          </View>
          <View style={{ width: "50%", marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>N° Y NOMBRE DE HIJOS: </Text>
            <Text style={{ ...styles.textContainer, fontSize: 9 }}>
              {props.datosGenerales.hijos.length + " hijos(as). "}
              {props.datosGenerales.hijos.map((hijo, i) => {
                return i < props.datosGenerales.hijos.length
                  ? hijo + ","
                  : hijo + ". ";
              })}
            </Text>
          </View>
          <View style={{ width: "100%", marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>GRADO DE INSTRUCCIÓN: </Text>
            <Text style={styles.text}>PRIMARIA</Text>
            <Text style={styles.checker}>
              {props.datosGenerales.grado == "Primaria" ? "X" : ""}
            </Text>

            <Text style={styles.text}> SECUNDARIA </Text>
            <Text style={styles.checker}>
              {props.datosGenerales.grado == "Secundaria" ? "X" : ""}
            </Text>

            <Text style={styles.text}> TÉCNICO </Text>
            <Text style={styles.checker}>
              {props.datosGenerales.grado == "Tecnico" ? "X" : ""}
            </Text>

            <Text style={styles.text}> UNIVERSITARIO </Text>
            <Text style={styles.checker}>
              {props.datosGenerales.grado == "Universitario" ? "X" : ""}
            </Text>

            <Text style={styles.text}> SIN INSTRUCCIÓN </Text>
            <Text style={styles.checker}>
              {props.datosGenerales.grado == "S/Inst." ? "X" : ""}
            </Text>
          </View>
          <View style={{ ...styles.horizontal, marginTop: 0 }}>
            <View style={{ width: "30%", ...styles.horizontal }}>
              <Text style={styles.textBold}>OCUPACIÓN: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosGenerales.ocupacion}
              </Text>
            </View>
            <View style={{ width: "70%", ...styles.horizontal }}>
              <Text style={styles.textBold}>BENEFICIOS: </Text>
              <Text style={styles.text}>RENTA DIGNIDAD</Text>
              <Text style={styles.checker}>
                {props.datosGenerales.beneficios == "Renta Dignidad" ? "X" : ""}
              </Text>

              <Text style={styles.text}> JUBILADO </Text>
              <Text style={styles.checker}>
                {props.datosGenerales.beneficios == "Jubilado" ? "X" : ""}
              </Text>

              <Text style={styles.text}> NINGUNO </Text>
              <Text style={styles.checker}>
                {props.datosGenerales.beneficios == "Ninguno" ? "X" : ""}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>DOMICILIO: </Text>
            <Text style={styles.text}> PROPIO </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.tipo_domicilio == "Propio" ? "X" : ""}
            </Text>
            <Text style={styles.text}> ALQUILADO </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.tipo_domicilio == "Alquilado" ? "X" : ""}
            </Text>

            <Text style={styles.text}> ANTICRÉTICO </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.tipo_domicilio == "Anticretico" ? "X" : ""}
            </Text>

            <Text style={styles.text}> CEDIDO </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.tipo_domicilio == "Cedido" ? "X" : ""}
            </Text>

            <Text style={styles.text}> OTRO </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.tipo_domicilio == "Otro" ? "X" : ""}
            </Text>

            {props.datosUbicacion.tipo_domicilio == "Otro" ? (
              <Text style={{ ...styles.textContainer }}>
                {props.datosUbicacion.otro_domicilio}
              </Text>
            ) : (
              <></>
            )}
          </View>

          <View style={{ ...styles.horizontal, marginTop: 0 }}>
            <Text style={styles.textBold}>DISTRITO: </Text>
            <Text style={{ ...styles.textContainer }}>
              {props.datosUbicacion.distrito}
            </Text>
            <Text style={{ ...styles.textBold, marginLeft: 5 }}>ZONA: </Text>
            <Text style={{ ...styles.textContainer }}>
              {props.datosUbicacion.zona}
            </Text>
            <Text style={{ ...styles.textBold, marginLeft: 5 }}>
              CALLE O AV.:{" "}
            </Text>
            <Text style={{ ...styles.textContainer }}>
              {props.datosUbicacion.calle_av}
            </Text>
            <Text style={{ ...styles.textBold, marginLeft: 5 }}>N°: </Text>
            <Text style={{ ...styles.textContainer }}>
              {props.datosUbicacion.nro_vivienda}
            </Text>
          </View>
          <View style={{ marginTop: 2, ...styles.horizontal }}>
            <Text style={styles.textBold}>AREA: </Text>
            <Text style={styles.text}>URBANO</Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.area == "Urbano" ? "X" : ""}
            </Text>

            <Text style={styles.text}> RURAL </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.area == "Rural" ? "X" : ""}
            </Text>

            <Text style={styles.text}> OTRO </Text>
            <Text style={styles.checker}>
              {props.datosUbicacion.area == "Otro" ? "X" : ""}
            </Text>

            {props.datosUbicacion.area == "Otro" ? (
              <Text style={{ ...styles.textContainer }}>
                {props.datosUbicacion.otra_area}
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
          {descripcion}
        </View>
        <Text style={{ ...styles.textBold, marginTop: 5, marginBottom: 2 }}>
          III. PETICIÓN DE LA PERSONA ADULTA MAYOR
        </Text>
        <View style={styles.container}>
          <View style={styles.text}>
            {peticion}
          </View>
        </View>

        <Text style={{ ...styles.textBold, marginTop: 5, marginBottom: 2 }}>
          IV. DATOS PERSONALES DEL DENUNCIADO(A)
        </Text>
        <View style={styles.container}>
          <View style={{ ...styles.horizontal, marginTop: 2 }}>
            <View style={{ width: "100%", ...styles.horizontal }}>
              <Text style={styles.textBold}>NOMBRES Y APELLIDOS: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosDenunciado.nombres +
                  " " +
                  props.datosDenunciado.paterno +
                  " " +
                  props.datosDenunciado.materno}
              </Text>
            </View>
            <View style={{ width: "100%", ...styles.horizontal }}>
              <Text style={styles.textBold}>PARENTEZCO: </Text>
              <Text style={{ ...styles.textContainer, fontSize: 9 }}>
                {props.datosDenunciado.parentezco}
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
              {props.accionRealizada.includes("Orientacion") ? "X" : ""}
            </Text>
            <Text style={styles.text}>CITACIÓN </Text>
            <Text style={styles.checker}>
              {props.accionRealizada.includes("Citacion") ? "X" : ""}
            </Text>
            <Text style={styles.text}>DERIVACIÓN </Text>
            <Text style={styles.checker}>
              {props.accionRealizada.includes("Derivacion") ? "X" : ""}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...styles.horizontal,
            marginTop: 120,
            marginLeft: 50
          }}
        >
          <Text style={{ ...styles.text, ...styles.textCenter }}>
            {`FIRMA O HUELLA DEL ADULTO(A) MAYOR \n ${props.datosGenerales.nombre} ${props.datosGenerales.paterno} ${props.datosGenerales.materno}`}
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
export default MyDocument;
