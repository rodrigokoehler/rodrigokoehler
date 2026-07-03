#!/usr/bin/env python3
"""Extrai o codigo-fonte embutido de um executavel AutoHotkey compilado.

Executaveis AutoHotkey v1.x guardam o script original como recurso RCDATA
chamado '>AUTOHOTKEY SCRIPT<'. Este utilitario localiza esse recurso e o
salva como texto (.ahk).

Uso: extrai_script.py <programa.exe> <saida.ahk>

Requer: pip install pefile
"""
import sys
import pefile


def main(exe_in, ahk_out):
    pe = pefile.PE(exe_in)
    for entry in pe.DIRECTORY_ENTRY_RESOURCE.entries:
        for res in entry.directory.entries:
            if res.name and 'AUTOHOTKEY' in str(res.name).upper():
                lang = res.directory.entries[0]
                data = pe.get_data(lang.data.struct.OffsetToData,
                                   lang.data.struct.Size)
                open(ahk_out, 'wb').write(data)
                print(f"ok: {ahk_out} ({len(data)} bytes)")
                return
    raise SystemExit("recurso '>AUTOHOTKEY SCRIPT<' nao encontrado "
                     "(o executavel nao parece ser AutoHotkey compilado)")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
