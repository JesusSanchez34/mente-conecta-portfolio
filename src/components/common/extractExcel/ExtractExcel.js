import exceljs from "exceljs";
import React, { Fragment, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { AiFillCheckCircle } from "react-icons/ai";
import "./ExtractExcel.css";

export function ExtractExcel(props) {
  const { onClose, data, fileName, dataRowsExcel } = props;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const columnsExcel = dataRowsExcel(data[0]);
  const keys = Object.keys(columnsExcel);
  const headers = getHeaders(keys);
  const columns = getColumns(keys, headers);
  const columnsData = getColumnData(data, dataRowsExcel);

  const descargarExcel = async () => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(`${fileName}`);
    worksheet.columns = columns;
    worksheet.addRows(columnsData);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();

    URL.revokeObjectURL(url);
    setShowSuccessModal(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <div>
      <center>
        <p>NOTA: SOLO ES UNA MUESTRA, LOS DEMÁS ARCHIVOS SE MOSTRARÁN AL DESCARGAR.</p>
      </center>
      <Table striped bordered hover responsive>
        <thead>
          <tr>{headers?.map((head, index) => [<th key={index}>{head}</th>])}</tr>
        </thead>
        <tbody>
          {columnsData?.slice(0, 3).map((column, index) => (
            <tr key={index}>
              <Fragment>
                {(() => {
                  const celdas = [];
                  for (let dato in column) celdas.push(<td key={dato}>{column[dato]}</td>);
                  return celdas;
                })()}
              </Fragment>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={descargarExcel} style={{ marginTop: "10px" }}>
        Descargar Excel
      </Button>

      <Modal show={showSuccessModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Se ha descargado el archivo con éxito.</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AiFillCheckCircle size={50} style={{ color: "#3a7411" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeModal} size="sm">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function getHeaders(keys) {
  const headers = [];
  keys.forEach((head) => {
    const data = head.replace(/_/g, " ");
    headers.push(data.toUpperCase());
  });
  return headers;
}

function getColumns(keys, headers) {
  const colums = [];
  for (let i = 0; i < keys.length; i++)
    colums.push({
      header: headers[i],
      key: keys[i],
    });
  return colums;
}

function getColumnData(data, dataRowsExcel) {
  const allData = [];
  data.forEach((column) => {
    allData.push(dataRowsExcel(column));
  });
  return allData;
}
