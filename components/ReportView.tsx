import React from 'react';

const isHeading = (line: string): boolean => {
    const trimmedLine = line.trim();
    return trimmedLine.startsWith('# ') ||
           trimmedLine.startsWith('## ') ||
           trimmedLine.startsWith('### ') ||
           trimmedLine.startsWith('Part ') ||
           trimmedLine.startsWith('Chapter ') ||
           /^\d+\.\d+.*/.test(trimmedLine);
}

const isProseParagraph = (line: string): boolean => {
    const trimmed = line.trim();
    // Heuristic: A line is likely a prose paragraph if it's not a heading,
    // starts with a capital letter, ends with a period, and is of reasonable length.
    if (isHeading(trimmed)) return false;
    if (trimmed.length < 25) return false;
    if (!/^[A-Z]/.test(trimmed)) return false;
    if (!/\.$/.test(trimmed)) return false;
    // Rule out lines with code-like syntax that might otherwise match
    if (trimmed.includes('=') || trimmed.includes('(') || trimmed.includes(')')) return false;

    return true;
}


// An enhanced markdown parser to handle code blocks and tables
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const elements: React.ReactNode[] = [];
  const lines = content.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (isHeading(line)) {
        if (line.startsWith('# ')) {
            elements.push(<h1 key={i} className="text-3xl font-bold mt-6 mb-3 border-b border-gray-600 pb-2">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ') || line.startsWith('Chapter ')) {
            const title = line.replace(/^(## |Chapter \d+:\s*)/, '');
            elements.push(<h2 key={i} className="text-2xl font-semibold mt-5 mb-2">{title}</h2>);
        } else {
            const title = line.replace(/^(### |\d+\.\d+\s*|Part (I|II|III|IV):\s*)/, '');
            elements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-2">{title}</h3>);
        }
        i++;
        continue;
    }
    
    if (line.trim().startsWith('- ')) {
      const listItems: React.ReactNode[] = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith('- ')) {
        listItems.push(<li key={j} className="ml-6 list-disc">{lines[j].trim().substring(2)}</li>);
        j++;
      }
      elements.push(<ul key={`ul-${i}`} className="my-2">{listItems}</ul>);
      i = j;
      continue;
    }
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-6 border-gray-600" />);
      i++;
      continue;
    }
    if (line.trim() === 'Python') {
      const codeLines: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
          const codeLine = lines[j];
          // End of code block is a blank line, a new heading, or a new prose paragraph
          if (codeLine.trim() === '' || isHeading(codeLine) || isProseParagraph(codeLine)) {
              break; 
          }
          codeLines.push(codeLine);
          j++;
      }
      elements.push(
        <pre key={`code-${i}`} className="bg-gray-900 p-4 rounded-md my-4 overflow-x-auto border border-gray-700">
          <code className="text-sm text-cyan-300 font-mono">{codeLines.join('\n')}</code>
        </pre>
      );
      i = j;
      continue;
    }
    // Simple table detection (tab-separated)
    if (line.includes('\t')) {
      const tableRows: string[][] = [];
      let j = i;
      while (j < lines.length && lines[j].includes('\t') && !isHeading(lines[j])) {
        tableRows.push(lines[j].split('\t'));
        j++;
      }
      
      const header = tableRows.shift();
      if(header) {
          elements.push(
            <div key={`table-${i}`} className="my-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600 border border-gray-600">
                <thead className="bg-gray-700/50">
                    <tr>
                    {header.map((th, index) => (
                        <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{th}</th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {tableRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-700/40">
                        {row.map((td, tdIndex) => (
                        <td key={tdIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{td}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          );
      }
      i = j;
      continue;
    }

    if (line.trim() !== '') {
        const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-300">$1</strong>');
        elements.push(<p key={i} className="my-2 text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldedLine }} />);
    }

    i++;
  }

  return <>{elements}</>;
};


interface ReportViewProps {
  report: string;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Simulation Report</h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
            <SimpleMarkdown content={report} />
        </div>
    </div>
  );
};
