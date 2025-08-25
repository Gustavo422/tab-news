function status(request, response) {
  response.status(200).json({ chave: "Gustavo sempre foi um homem lindão!" });
}

export default status;
