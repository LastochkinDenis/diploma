import { getUserCertificate } from "../../api/getUserInfo";

import { useState, useEffect } from "react";
import "./UserPageStyle.css";
import {
  Document,
  Page,
  StyleSheet,
  PDFDownloadLink,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";
import { useSelector } from "react-redux";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoGet: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "90%",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Roboto",
  },
});

export default function UserPage() {
  const [certificate, setCertificate] = useState([]);
  const user = useSelector((state) => state.user).user;

  useEffect(() => {
    const getData = async () => {
      const data = await getUserCertificate();
      setCertificate(data);
    }

    getData();
  }, []);

  const MyDocument = (props) => (
    <Document>
      <Page size="A5" style={styles.page} orientation="landscape">
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.name}</Text>
          <Text style={styles.text}>{props.idSer}</Text>
        </View>
        <View style={styles.infoGet}>
          <Text style={styles.text}>{`Дата получения ${props.dateGet}`}</Text>
          <Text style={styles.text}>{props.userName}</Text>
        </View>
      </Page>
    </Document>
  );

  if (user) {
    return (
      <div>
        <div className="user-head">
          <div className="user-head__image">
            {user.firstName && (
              <p>
                {user.firstName[0].toUpperCase() +
                  "" +
                  user.lastName[0].toUpperCase()}
              </p>
            )}
          </div>
          <div className="user-head__name">
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
          </div>
        </div>
        <div className="sertifacate-list__wraper">
          <p>Список полученых сертификатов</p>
          <div className="sertifacate-list">
            {certificate.map((item, index) => {
              return (
                <div className="sertifacate-item" key={index}>
                  <p>{item.nameCourse}</p>
                  <PDFDownloadLink
                    document={
                      <MyDocument
                        name={item.nameCourse}
                        idSer={item.id}
                        dateGet={item.date}
                        userName={`${user.lastName} ${user.firstName}`}
                      />
                    }
                    fileName={`${item.nameCourse}.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Скачивается" : "Скачать сертификат"
                    }
                  </PDFDownloadLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return <p></p>;
  }
}
