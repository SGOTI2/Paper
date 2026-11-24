import { useContext, useState } from 'react';
import { UnifiedStaticData } from '../lib/unifiedStaticData';
declare const __BUILD_TIME__: string;

export default function SINNCTManagement() {
  const unifiedStaticState = useContext(UnifiedStaticData);
  const [fileContent, setFileContent] = useState<string[][]>(() => {
    return Object.entries(unifiedStaticState.SINNCT).map(([key, value]) => [key, value]);
  });
  const [problems, setProblems] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(row => row.trim() !== '').map(row => row.split(','));
      setFileContent(rows);
      setProblems(null);
    };
    reader.onerror = () => {
      setProblems("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    // Only allow digits in the Student ID column
    if (colIndex === 0) {
      value = value.replace(/[^0-9]/g, '');
    }
    const newContent = [...fileContent];
    newContent[rowIndex] = [...newContent[rowIndex]];
    newContent[rowIndex][colIndex] = value;
    setFileContent(newContent);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setFileContent(fileContent.filter((_, i) => i !== rowIndex));
  };

  const handleSave = () => {
    const rows = fileContent.filter(row => row.some(cell => cell.trim() !== ''));
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SINNCT.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inbedSINNCT = () => {
    let USD_data = {...unifiedStaticState};
    USD_data.SINNCT = Object.fromEntries(
      fileContent
        .filter(row => row.length >= 2 && row[0].trim() !== '')
        .map(row => [row[0].trim(), row[1].trim()])
    );
    localStorage.setItem("USDConfig", JSON.stringify(USD_data));
    localStorage.setItem("USDConfigVersion", __BUILD_TIME__);
    window.location.reload();
  }

  const colCount = fileContent.length > 0 ? fileContent[0].length : 2;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">SINNCT Management</h1>
      <p className="text-gray-500 mb-2">Manage SINNCT data</p>

      {problems && <p className="text-red-500 font-bold">{problems}</p>}
      <p className="text-gray-500 my-2">
        SINNCT or Student Identification Number Name Conversion Table, is a CSV file that converts the raw id for the task owner to the name of the student that it is associated with.<br/>
        This pannel allows for SID's to be imported into the USD.cfg file for transfer over a USD patch. Idealy this USD patch is <b>NOT</b> included in the built code and is patched into devices on a need-to-know basis. This mostly exists for student privacy and ED2D compliance.<br/>
        The only devices that really need the patched USD.cfg are the devices that have the live pannel and the tablet login system.<br/>
        <i>After the you click "Imbed" go back to the USD Creator and send the config to the devices.</i>
      </p>

      <table className="min-w-lg border-separate border-spacing-0 border border-gray-700 rounded-xl overflow-hidden">
        <thead>
          <tr>
            <th className="border-b border-r border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm font-semibold text-gray-300">
              Student ID
            </th>
            <th className="border-b border-r border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm font-semibold text-gray-300">
              Name
            </th>
            <th className="border-b border-gray-700 bg-gray-800 px-3 py-2 text-center text-sm font-semibold text-gray-300">
              {' '}
            </th>
          </tr>
        </thead>
        <tbody>
          {fileContent.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border-b border-r border-gray-700 p-1">
                  <input
                    type={colIndex === 0 ? 'number' : 'text'}
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    className="w-full p-1 text-sm bg-transparent focus:outline-none"
                  />
                </td>
              ))}
              <td className="border-b border-gray-700 p-1 text-center">
                <button
                  onClick={() => handleDeleteRow(rowIndex)}
                  title="Delete row"
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={colCount} className="p-1">
              <button
                onClick={() => {
                  setFileContent([...fileContent, new Array(colCount).fill('')]);
                }}
                className="w-full text-sm py-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                + Add Row
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex gap-2 w-full">
        <button
          onClick={handleSave}
          disabled={fileContent.length === 0}
          className="text-white p-2 px-3 rounded bg-blue-500 cursor-pointer hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save as CSV
        </button>
        
        <button
          onClick={inbedSINNCT}
          disabled={fileContent.length === 0}
          className="text-white p-2 px-3 rounded bg-green-500 cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Inbed SINNCT in USD
        </button>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block text-sm text-gray-400
            file:mr-4 file:py-2 file:px-3
            file:rounded file:border-0
            file:text-base
            file:bg-gray-600 file:text-white
            cursor-pointer
            hover:file:bg-gray-500"
        />
      </div>
    </div>
  );
}