#!/usr/bin/env python3
"""Injeta um script .ahk no recurso RCDATA '>AUTOHOTKEY SCRIPT<' de um
executavel AutoHotkey compilado (stub v1.x), sem alterar tamanhos.

O script novo precisa caber no espaco do original; o restante e preenchido
com quebras de linha (ignoradas pelo AutoHotkey). Assim nenhum offset do PE
muda e o executavel permanece integro.

Uso: injeta_script.py <exe_original> <script.ahk> <exe_saida>
"""
import sys
import pefile


def find_script_entry(pe):
    for entry in pe.DIRECTORY_ENTRY_RESOURCE.entries:
        for res in entry.directory.entries:
            if res.name and 'AUTOHOTKEY' in str(res.name).upper():
                lang = res.directory.entries[0]
                return lang.data.struct.OffsetToData, lang.data.struct.Size
    raise SystemExit("recurso '>AUTOHOTKEY SCRIPT<' nao encontrado")


def main(exe_in, ahk_in, exe_out):
    pe = pefile.PE(exe_in)
    rva, size = find_script_entry(pe)
    file_off = pe.get_offset_from_rva(rva)
    pe.close()

    script = open(ahk_in, 'rb').read()
    if len(script) > size:
        raise SystemExit(f"script tem {len(script)} bytes; maximo {size}")
    script = script + b'\n' * (size - len(script))
    assert len(script) == size

    data = bytearray(open(exe_in, 'rb').read())
    data[file_off:file_off + size] = script

    out = pefile.PE(data=bytes(data))
    out.OPTIONAL_HEADER.CheckSum = out.generate_checksum()
    out.write(exe_out)
    print(f"ok: {exe_out} (script {len(open(ahk_in,'rb').read())} bytes, "
          f"espaco {size}, offset 0x{file_off:x})")


if __name__ == '__main__':
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2], sys.argv[3])
