import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import ProductoModal from './ProductoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';


// const API = process.env.REACT_APP_API;
const API = "http://localhost:8000/api/v1"

const List = () => {

  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(0);

  const getProductos = async () => {
    const r = await fetch(
      `${API}/0`,
      {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
    const list = await r.json();
    setProductos(list);
  };


  useEffect(() => {
    getProductos();
  }, [])

  let modalProps = {
    show: showModal,
    setShow: setShowModal,
    editing,
    id,
    setId,
    productos,
    setProductos,
  }


  return (
    <>
      <ProductoModal {...modalProps}></ProductoModal>
      <Button variant='success' style={{ width: 100 + '%' }} onClick={() => { setShowModal(true); setEditing(false); setId(0) }}>
        Agregar Nuevo Producto
      </Button>
      <Table>
        <thead>
          <tr>
            <th>
              Hecho
            </th>
            <th>
              Producto
            </th>
            <th>
              Cantidad
            </th>
            <th>
              Tipo de tienda
            </th>
            <th>
              Operaciones
            </th>
          </tr>
        </thead>
        <tbody>
          {
            productos.map(p => (
              <tr>
                <td>
                  <Form>
                    <Form.Group>
                      <Form.Check type='checkbox' />
                    </Form.Group>
                  </Form>
                </td>
                <td>
                  {p.producto}
                </td>
                <td>
                  {p.cantidad}
                </td>
                <td>
                  {p.tipo_tienda}
                </td>
                <td>
                  <ButtonGroup className='mb-2'>
                    <Button variant='primary' onClick={() => { setShowModal(true); setEditing(true); setId(p.id) }}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    <Button variant='danger'>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            )
            )
          }
        </tbody>
      </Table>
    </>
  );
}

export default List;
