import * as Papa from 'papaparse';
import * as fs from 'fs';

export async function ReadCSV() {
    fs.readFile('./tmp', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        Papa.parse(data, {
            skipEmptyLines: true,
            header: true,
            complete: (results) => {
                // Filtra as linhas onde `_8` (representando a coluna `I`) é maior que 0 após conversão
                const filteredData = results.data.filter((row) => {
                    const valueI = parseFloat(row._8?.replace(',', '.').trim() || '0');
                    return valueI > 0;
                });

                // console.log(filteredData);



                const data = filteredData.map((row) => {
                    return {
                        lp_id: row._1,
                        unit: parseFloat(row._8.replace(',', '.').trim()), // Converte _8 para número
                        value_per_unit: parseFloat(row._14.replace(/[^\d,]/g, '').replace(',', '.'))
                    }
                })

                console.log(data)
            },
        });
    });

}

