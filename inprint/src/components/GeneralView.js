import React, {Component} from 'react';

class GeneralView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: 'asc',
      orderBy: 'fechaPedido',
    };
  }

  handleSort = (field) => {
    const { sortOrder, orderBy } = this.state;
    const newSortOrder = orderBy === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

    this.setState({
      sortOrder: newSortOrder,
      orderBy: field,
    });
  };

  render() {
    
    // try {

      const { sortOrder, orderBy } = this.state;

      const pedidos = [
        { fechaPedido: '2023-11-13', fechaEntrega: '2023-11-20', estado: 'En proceso', nombreArchivo: 'archivo1.stl', tipoFabricacion: 'Impresión', material: 'Grey V4' },
        { fechaPedido: '2023-11-13', fechaEntrega: '2023-11-18', estado: 'Enviado', nombreArchivo: 'archivo2.stl', tipoFabricacion: 'Impresión', material: 'Tranparent Green' },
        { fechaPedido: '2023-11-12', fechaEntrega: '2023-11-20', estado: 'Terminado', nombreArchivo: 'archivo3.stl', tipoFabricacion: 'Mecanizado', material: '3 ejes' },
        { fechaPedido: '2023-11-11', fechaEntrega: '2023-11-15', estado: 'En proceso', nombreArchivo: 'archivo4.stl', tipoFabricacion: 'Mecanizado', material: '5 ejes' },
        { fechaPedido: '2023-11-12', fechaEntrega: '2023-11-18', estado: 'Enviado', nombreArchivo: 'archivo5.stl', tipoFabricacion: 'Impresión', material: 'Grey V4' },      
        { fechaPedido: '2023-11-14', fechaEntrega: '2023-11-19', estado: 'En proceso', nombreArchivo: 'archivo6.stl', tipoFabricacion: 'Mecanizado', material: '3 ejes' },
        { fechaPedido: '2023-11-13', fechaEntrega: '2023-11-20', estado: 'Terminado', nombreArchivo: 'archivo7.stl', tipoFabricacion: 'Impresión', material: 'Grey V4' },
      ];

      const sortedPedidos = [...pedidos].sort((a, b) => {
        const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
        return a[orderBy] > b[orderBy] ? orderMultiplier : -orderMultiplier;
      });

      const estilosTabla = {
        th: {
          backgroundColor: '#ABEBC6',
          border: '1px solid #dddddd',
          textAlign: 'left',
          padding: '8px',
        },
        td: {
          border: '1px solid #dddddd',
          textAlign: 'left',
          padding: '8px',
        },
        filaPar: {
          backgroundColor: '#D5F5E3',
        },
        filaImpar: {
          backgroundColor: '#EAFAF1',
        },
      };


      var display = 
        <div style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={estilosTabla.th} onClick={() => this.handleSort('fechaPedido')}>
                  Fecha de Pedido {orderBy === 'fechaPedido' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th style={estilosTabla.th} onClick={() => this.handleSort('fechaEntrega')}>
                  Fecha de Entrega {orderBy === 'fechaEntrega' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th style={estilosTabla.th} onClick={() => this.handleSort('estado')}>
                  Estado {orderBy === 'estado' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th style={estilosTabla.th} onClick={() => this.handleSort('nombreArchivo')}>
                  Nombre de Archivo {orderBy === 'nombreArchivo' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th style={estilosTabla.th} onClick={() => this.handleSort('tipoFabricacion')}>
                  Tipo de Fabricación {orderBy === 'tipoFabricacion' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </th>
                <th style={estilosTabla.th} onClick={() => this.handleSort('material')}>
                  Opción {orderBy === 'material' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </th>
              </tr>
            </thead>          
              <tbody>
                {sortedPedidos.map((pedido, index) => (
                  <tr key={index} style={index % 2 === 0 ? estilosTabla.filaPar : estilosTabla.filaImpar}>
                    <td style={estilosTabla.td}>{pedido.fechaPedido}</td>
                    <td style={estilosTabla.td}>{pedido.fechaEntrega}</td>
                    <td style={estilosTabla.td}>{pedido.estado}</td>
                    <td style={estilosTabla.td}>{pedido.nombreArchivo}</td>
                    <td style={estilosTabla.td}>{pedido.tipoFabricacion}</td>
                    <td style={estilosTabla.td}>{pedido.material}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>

      return (
        <div style={{ width: '100%' }}>       
          <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <h3>Listado de Pedidos</h3>
            {display}
          </div>
        </div>
      )
    // } catch (err) {
    //   setTimeout(() => window.location.reload(), 2000);
    //   return (<div>Error al cargar la lista de pedidos</div>)
    // }
  }     
}

export default GeneralView;
