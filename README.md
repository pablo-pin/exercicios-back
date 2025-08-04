### ✅ Como utilizar

1. **Faça um fork do repositório** e **DESMARQUE** a opção `Copy the main branch only`.

2. **Clone o repositório para o seu computador** e acesse o diretório do projeto:
   ```bash
   git clone git@github.com:pinaculo-digital/exercicios-back.git
   cd exercicios-back

3. **Liste todas as branches remotas disponíveis:**

   ```bash
   git branch -r
   ```

4. **Crie uma branch local para o problema que for solucionar**, com base na branch remota correspondente.

   Por exemplo, se ao rodar `git branch -r` o resultado for:

   ```
   origin/main
   origin/problem-1
   origin/problem-2
   origin/problem-3
   origin/problem-4
   origin/problem-5
   origin/problem-6
   origin/problem-7
   ```

   Para criar uma branch local para resolver o **problema 1**, execute:

   ```bash
   git checkout -b problem-1 origin/problem-1
   ```

5. **Crie o arquivo `.env`** com os dados necessários para cada problema.

6. **Utilize um banco de dados diferente para cada problema**, pois cada um possui um **schema** e uma **seed** diferente.
