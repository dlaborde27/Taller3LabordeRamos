AWS.config.update({
    accessKeyId: '', 
    secretAccessKey: '',
    sessionToken: '',
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = 'josedariotallerlambdadynamo';
let foto;

document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const idNumber = document.getElementById('idNumber').value;
    const email = document.getElementById('email').value;

    const response = await fetch('https://8d2s3kmln4.execute-api.us-east-1.amazonaws.com/default/Jose_Dario_Taller_Lambda_Dynamo', {
        method: 'POST',
        body: JSON.stringify({
            "TableName": "Usuario",
            "Item": {
            Cedula: idNumber,
            Nombre: firstName,
            Apellido: lastName,
            Correo: email,
            Foto: foto
            }
        })
    });

    await mostrarUsuarios();
});

async function mostrarUsuarios() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    const response = await fetch('https://8d2s3kmln4.execute-api.us-east-1.amazonaws.com/default/Jose_Dario_Taller_Lambda_Dynamo?TableName=Usuario');
    const data = await response.json();
    data.Items.forEach(item => {
        const listItem = document.createElement('li');
        const img = document.createElement('img');
        img.src = item.Foto;
        img.alt = `${item.Nombre} ${item.Apellido}`;
        img.style.width = '50px';
        img.style.height = '50px';

        const textContent = document.createTextNode(`Nombres: ${item.Nombre} ${item.Apellido}, Cédula: ${item.Cedula}, Correo: ${item.Correo}`);
        listItem.appendChild(img);
        listItem.appendChild(textContent);
        userList.appendChild(listItem);
    });
    
}

document.getElementById('uploadPhoto').addEventListener('click', function() {
    const files = document.getElementById('photo').files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const params = {
            Bucket: bucketName,
            Key: file.name,
            Body: file,
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error subiendo el archivo:', err);
            } else {
                console.log('Archivo subido con éxito:', data.Location);
                foto = data.Location
            }
        });
    }
});